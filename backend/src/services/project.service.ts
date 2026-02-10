import mongoose, { Types } from "mongoose"
import { Project } from "../models/project.model";
import { NotFoundException } from "../utils/appError";
import { Task } from "../models/task.model";
import { TaskPriorityEnum, TaskPriorityEnumType, TaskStatusEnum, TaskStatusEnumType } from "../enums/task.enums";


// Service to create a new project in a workspaceId
export const createProjectService = async (workspaceId: string, projectData: {
    emoji?: string;
    name: string;
    description?: string;
}, userId: Types.ObjectId) => {

    const project = new Project({
        ...(projectData.emoji && { emoji: projectData.emoji }),
        workspace: workspaceId,
        createdBy: userId,
        description: projectData.description,
        name: projectData.name,
        allowedMembers: [userId],
    });
    await project.save();

    return { project };
}

// Service to get all projects in a workspace with pagination
export const getAllProjectsInWorkspaceService = async (workspaceId: string, pageSize: number, pageNumber: number) => {
    const skip = (pageNumber - 1) * pageSize;

    const [totalCount, projects] = await Promise.all([
        Project.countDocuments({ workspace: workspaceId }),
        Project.find({ workspace: workspaceId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(pageSize)
            .populate("createdBy", "_id name email profilePicture")
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return { projects, totalCount, totalPages, skip };
}

// Service to get all User Only projects in a workspace with pagination
export const getAllUserProjectsInWorkspaceService = async (workspaceId: string, pageSize: number, pageNumber: number, userId: Types.ObjectId) => {
    const skip = (pageNumber - 1) * pageSize;

    const [totalCount, projects] = await Promise.all([
        Project.countDocuments({ workspace: workspaceId, allowedMembers: userId }),
        Project.find({ workspace: workspaceId, allowedMembers: userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(pageSize)
            .populate("createdBy", "_id name email profilePicture")
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return { projects, totalCount, totalPages, skip };
}

// Service to get a specific project by its ID within a workspace
export const getProjectWithIdInWorkspaceService = async (projectId: string, workspaceId: string) => {
    const project = await Project.findOne({ _id: projectId, workspace: workspaceId }).select("_id name description emoji ");

    if (!project) {
        throw new NotFoundException("Project not found in the specified workspace");
    }

    return { project };
}

//Service to get project analytics by its ID within a workspace
export const getProjectWithIdInWorkspaceAnalyticsService = async (projectId: string, workspaceId: string) => {

    const project = await Project.findOne({ _id: projectId, workspace: workspaceId });
    if (!project) {
        throw new NotFoundException("Project not found in the specified workspace");
    }

    const currentDate = new Date();

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 7);


    const analytics = await Task.aggregate([
        {
            $match: {
                workspace: new mongoose.Types.ObjectId(workspaceId),
                project: new mongoose.Types.ObjectId(projectId)
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
                weeklyCompleted: [
                    {
                        $match: {
                            status: TaskStatusEnum.DONE,
                            updatedAt: { $gte: startOfWeek }
                        }
                    },
                    { $count: "count" }
                ],
                tasksByStatus: [
                    {
                        $group: {
                            _id: "$status",
                            count: { $sum: 1 },
                        },
                    },
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

    const normalizeStatus = (arr: Array<{ _id: TaskStatusEnumType; count: number }>) => {
        const base: Record<TaskStatusEnumType, number> = {
            [TaskStatusEnum.BACKLOG]: 0,
            [TaskStatusEnum.TODO]: 0,
            [TaskStatusEnum.DONE]: 0,
            [TaskStatusEnum.IN_PROGRESS]: 0,
            [TaskStatusEnum.IN_REVIEW]: 0,
        };

        arr.forEach((item) => {
            base[item._id] = item.count;
        });

        return base;
    };

    const projectAnalytics = {
        totalTasks: analytics[0].totalTasks[0]?.count || 0,
        overdueTasksByPriority: normalizePriority(analytics[0].overdueTasksByPriority),
        todayTaskByPriority: normalizePriority(analytics[0].todayTaskByPriority),
        tasksByStatus: normalizeStatus(analytics[0].tasksByStatus),
        weeklyCompleted: analytics[0].weeklyCompleted[0]?.count || 0
    };

    return { analytics: projectAnalytics };

}

// Service to update a project by its ID within a workspace
export const updateProjectService = async (workspaceId: string, projectId: string, projectData: {
    emoji?: string;
    name?: string;
    description?: string;
}) => {
    const { emoji, name, description } = projectData;
    const project = await Project.findOne({ _id: projectId, workspace: workspaceId });
    if (!project) {
        throw new NotFoundException("Project not found in the specified workspace");
    }

    if (emoji) { project.emoji = emoji; }
    if (name) { project.name = name; }
    if (description) {
        project.description = description;
    }
    await project.save();

    return { updatedproject: project };
}

// Service to delete a project by its ID within a workspace
export const deleteProjectService = async (workspaceId: string, projectId: string) => {
    let session: mongoose.ClientSession | null = null;
    try {
        session = await mongoose.startSession();
        session.startTransaction();

        const project = await Project.findOne({ _id: projectId, workspace: workspaceId }).session(session);
        if (!project) {
            throw new NotFoundException("Project not found in the specified workspace");
        }

        await Task.deleteMany({ workspace: workspaceId, project: projectId }).session(session);

        await project.deleteOne({ session });

        await session.commitTransaction();
        session.endSession();

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