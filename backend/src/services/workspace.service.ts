import mongoose, { Types } from "mongoose";
import { Member } from "../models/member.model";
import { Role } from "../models/roles-permission.model";
import { User } from "../models/user.model";
import { BadRequestException, NotFoundException } from "../utils/appError";
import { Workspace, WorkspaceDocument } from "../models/workspace.model";
import { Roles } from "../enums/role.enums";
import { Task } from "../models/task.model";
import { TaskPriorityEnum, TaskPriorityEnumType, TaskStatusEnum } from "../enums/task.enums";
import { Project } from "../models/project.model";


// CREATE NEW WORKSPACE
export const createWorkspaceService = async (
    userId: Types.ObjectId,
    body: {
        name: string;
        description?: string
    }
) => {
    const { name, description } = body;

    const user = await User.findById(userId);
    if (!user) {
        throw new NotFoundException("User not found");
    }

    const ownerRole = await Role.findOne({ name: Roles.OWNER });
    if (!ownerRole) {
        throw new NotFoundException("Owner role not found");
    }

    const workspace = new Workspace({
        name: name,
        description: description,
        owner: user._id
    });
    await workspace.save();

    const member = new Member({
        userId: user._id,
        workspaceId: workspace._id,
        role: ownerRole._id,
        joinedAt: new Date()
    });
    await member.save();

    user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
    await user.save();

    return { workspace };
}

// GET WORKSPACES USER IS A MEMBER 
export const getAllWorkspacesUserisMemberService = async (userId: Types.ObjectId) => {
    const memberships = await Member
        .find({ userId })
        .populate('workspaceId')
        .exec();

    // Extract workspaces details from memberships
    const workspaces = memberships.map(
        (membership) => membership.workspaceId
    );

    return { workspaces };
}

// GET WORKSPACE BY ID after confirming user membership
export const getWorkspaceByIdService = async (workspaceId: string, workspace: WorkspaceDocument) => {
    const members = await Member.find({ workspaceId })
        .populate("role")
        .exec();

    const workspaceWithMembers = {
        ...workspace.toObject(),
        members
    };

    return { workspace: workspaceWithMembers };
}

//Get all WORKSPACE MEMBERS
export const getWorkspaceMembersService = async (workspaceId: string) => {
    const members = await Member.find({ workspaceId })
        .populate("userId", "name email profilePicture")
        .populate("role", "name")
        .exec();

    const roles = await Role.find({}, { name: 1, _id: 1 })
        .select("-permission")
        .lean();

    return { members, roles };
}

// GET WORKSPACE ANALYTICS
export const getWorkspaceAnalyticsService = async (workspaceId: string) => {
    const currentDate = new Date();

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 7);


    const analytics = await Task.aggregate([
        {
            $match: {
                workspace: new mongoose.Types.ObjectId(workspaceId)
            }
        },
        {
            $facet: {
                totalTasks: [
                    {
                        $match: {
                            status: { $ne: TaskStatusEnum.DONE }
                        }
                    },
                    { $count: "count" }
                ],

                overdueTasksByPriority: [
                    {
                        $match: {
                            dueDate: { $lt: currentDate },
                            status: { $ne: TaskStatusEnum.DONE }
                        }
                    },
                    {
                        $group: {
                            _id: "$priority",
                            count: { $sum: 1 }
                        }
                    }
                ],

                todayTaskByPriority: [
                    {
                        $match: {
                            dueDate: {
                                $eq: currentDate
                            },
                            status: { $ne: TaskStatusEnum.DONE }
                        }
                    },
                    {
                        $group: {
                            _id: "$priority",
                            count: { $sum: 1 }
                        }
                    }
                ],
                InReviewTasksByPriority: [
                    {
                        $match: {
                            status: TaskStatusEnum.IN_REVIEW
                        }
                    },
                    {
                        $group: {
                            _id: "$priority",
                            count: { $sum: 1 }
                        }
                    }
                ],

                weeklyCompleted: [
                    {
                        $match: {
                            status: TaskStatusEnum.DONE,
                            updatedAt: { $gte: startOfWeek }
                        }
                    },
                    { $count: "count" }
                ]
            }
        }
    ]);

    // ------------------------------
    // NORMALIZE PRIORITY OUTPUT
    // ------------------------------
    const normalizePriority = (arr: Array<{ _id: TaskPriorityEnumType; count: number }>) => {
        const base: Record<TaskPriorityEnumType, number> = {
            [TaskPriorityEnum.HIGH]: 0,
            [TaskPriorityEnum.MEDIUM]: 0,
            [TaskPriorityEnum.LOW]: 0,
        };

        arr.forEach((item) => {
            base[item._id] = item.count;
        });

        return base;
    };

    const workspaceAnalytics = {
        totalTasks: analytics[0].totalTasks[0]?.count || 0,
        overdueTasksByPriority: normalizePriority(analytics[0].overdueTasksByPriority),
        todayTaskByPriority: normalizePriority(analytics[0].todayTaskByPriority),
        inReviewTasksByPriority: normalizePriority(analytics[0].InReviewTasksByPriority),
        weeklyCompleted: analytics[0].weeklyCompleted[0]?.count || 0
    };

    return { analytics: workspaceAnalytics };
};


// CHANGE MEMBER ROLE IN WORKSPACE
export const changeMemberRoleService = async (
    workspaceId: string,
    memberUserId: string,
    roleId: string) => {

    const role = await Role.findById(roleId);
    if (!role) {
        throw new NotFoundException("Role not found");
    }

    const member = await Member.findOne({ userId: memberUserId, workspaceId });
    if (!member) {
        throw new NotFoundException("Member not found in this workspace");
    }

    member.role = role;
    await member.save();

    return { updatedMember: member };
}

// UPDATE WORKSPACE DETAILS
export const updateWorkspaceByIdService = async (
    workspace: WorkspaceDocument,
    name?: string,
    description?: string
) => {
    workspace.name = name || workspace.name;
    workspace.description = description || workspace.description;
    await workspace.save();

    return { updatedWorkspace: workspace };
}

// DELETE WORKSPACE BY ID
export const deleteWorkspaceByIdService = async (
    workspaceId: string,
    userId: Types.ObjectId
) => {
    let session: mongoose.ClientSession | null = null;
    try {
        session = await mongoose.startSession();
        session.startTransaction();

        const workspace = await Workspace.findById(workspaceId).session(session);
        if (!workspace) {
            throw new NotFoundException("Workspace not found, Some Server Error");
        }

        if (!workspace.owner.equals(userId)) {
            throw new BadRequestException("Only workspace owner can delete the workspace");
        }

        const user = await User.findById(userId).session(session);
        if (!user) {
            throw new NotFoundException("User not found, Some Server Error");
        }

        await Project.deleteMany({ workspace: workspace._id }).session(session);

        await Task.deleteMany({ workspace: workspace._id }).session(session);

        await Member.deleteMany({ workspaceId: workspace._id }).session(session);

        if (user?.currentWorkspace?.equals(workspaceId)) {
            const memberWorkspaces = await Member.findOne({ userId: user._id }).session(session);

            user.currentWorkspace = memberWorkspaces ? memberWorkspaces.workspaceId : null;

            await user.save({ session });
        }

        await Workspace.deleteOne({ _id: workspace._id }).session(session);

        await session.commitTransaction();
        session.endSession();

        return { currentWorkspace: user.currentWorkspace }

    }
    catch (error) {
        console.error("Error during deleting the Workspace", error);
        if (session && session.inTransaction())
            await session.abortTransaction();
        if (session)
            await session.endSession();
        throw error;

    } finally {
        if (session)
            await session.endSession();
    }
}



