import { Types } from "mongoose";
import { TaskPriorityEnum, TaskPriorityEnumType, TaskStatusEnum, TaskStatusEnumType } from "../enums/task.enums";
import { Member } from "../models/member.model";
import { Project, ProjectDocument } from "../models/project.model";
import { Task } from "../models/task.model";
import { NotFoundException } from "../utils/appError";
import isEnumValue from "../utils/enumValidate";

//Service to create Task
export const createTaskService = async (
    workspaceId: string,
    projectId: string,
    userId: Types.ObjectId,
    taskData: {
        title: string;
        description?: string;
        priority: string;
        status: string;
        assignedTo?: string | null;
        dueDate?: string;
    }
) => {
    const { title, description, priority, status, assignedTo, dueDate } = taskData;

    if (assignedTo) {
        const isAssignedUserMember = await Member.exists({
            userId: assignedTo,
            workspaceId: workspaceId
        });

        if (!isAssignedUserMember) {
            throw new Error("Assigned user is not a member of the workspace.");
        }
    }

    const project = await Project.findOneAndUpdate(
        { _id: projectId, workspace: workspaceId },
        {
            $addToSet: {
                allowedMembers: {
                    $each: [userId, assignedTo].filter(Boolean),
                },
            },
        },
        { new: true }
    );

    if (!project) {
        throw new NotFoundException(
            "Project not found in the specified workspace."
        );
    }


    const task = new Task({
        title,
        description,
        priority: priority || TaskPriorityEnum.MEDIUM,
        status: status || TaskStatusEnum.TODO,
        project: projectId,
        workspace: workspaceId,
        createdBy: userId,
        assignedTo: assignedTo || null,
        dueDate: dueDate ? new Date(dueDate) : undefined,
    });

    await task.save();

    return { task };

}

//Service to update Task
export const updateTaskService = async (projectId: string, taskId: string, workspaceId: string, body: {
    title?: string;
    description?: string;
    priority?: string;
    status?: string;
    assignedTo?: string | null;
    dueDate?: string;
}, userId: Types.ObjectId) => {
    const { title, description, priority, status, assignedTo, dueDate } = body;

    if (assignedTo) {
        const isAssignedUserMember = await Member.exists({
            userId: assignedTo,
            workspaceId: workspaceId
        });

        if (!isAssignedUserMember) {
            throw new Error("Assigned user is not a member of the workspace.");
        }
    }

    const project = await Project.findOneAndUpdate(
        { _id: projectId, workspace: workspaceId },
        {
            $addToSet: {
                allowedMembers: {
                    $each: [userId, assignedTo].filter(Boolean),
                },
            },
        },
        { new: true }
    );

    if (!project) {
        throw new NotFoundException(
            "Project not found in the specified workspace."
        );
    }
    const task = await Task.findOne({ _id: taskId, workspace: workspaceId, project: projectId });
    if (!task) {
        throw new NotFoundException("Task not found or does not belong to this workspace or project")
    }

    if (title) task.title = title;
    if (description) task.description = description;

    if (priority) {
        if (!isEnumValue(TaskPriorityEnum, priority)) {
            throw new Error("Invalid task priority");
        }
        task.priority = priority;
    }

    if (status) {
        if (!isEnumValue(TaskStatusEnum, status)) {
            throw new Error("Invalid task status");
        }
        task.status = status;
    }

    if (assignedTo !== undefined) {
        task.assignedTo = assignedTo ? new Types.ObjectId(assignedTo) : null;
    }

    if (dueDate) {
        task.dueDate = new Date(dueDate);
    }

    await task.save();

    return { updatedTask: task }
}

//Service to get all User Task
export const getAllTaskService = async (workspaceId: string, pagination: {
    pageSize: number;
    pageNumber: number;
}, filters: {
    projectId?: string;
    status?: string[];
    priority?: string[];
    assignedTo?: string[];
    keyword?: string;
    dueDate?: string;
}) => {
    const query: Record<string, any> = { workspace: workspaceId };

    if (filters.projectId) {
        query.project = filters.projectId;

    }
    if (filters.status?.length) {
        query.status = { $in: filters.status };
    }

    if (filters.priority?.length) {
        query.priority = { $in: filters.priority };
    }

    if (filters.assignedTo?.length) {
        query.assignedTo = { $in: filters.assignedTo };
    }

    if (filters.keyword) {
        query.title = { $regex: filters.keyword, $options: "i" };
    }

    if (filters.dueDate) {
        query.dueDate = {
            $eq: new Date(filters.dueDate),
        };
    }

    //Pagination Setup
    const { pageSize, pageNumber } = pagination;
    const skip = (pageNumber - 1) * pageSize;

    const [tasks, totalCount] = await Promise.all([
        Task.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(pageSize)
            .populate("assignedTo", "_id name profilePicture")
            .populate("project", "_id emoji name"),
        
        Task.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
        tasks,
        pagination: {
            pageSize,
            pageNumber,
            totalCount,
            totalPages,
            skip,
        }
    };
};

//Service to get task by Id
export const getTaskByIdService = async (workspaceId: string, projectId: string, taskId: string) => {
    const project = await Project.findOne({ _id: projectId, workspace: workspaceId });
    if (!project) {
        throw new NotFoundException("Project not found in the specified workspace");
    }

    const task = await Task.findOne({ _id: taskId, workspace: workspaceId, project: projectId })
        .populate("assignedTo", "_id name profilePicture")
    if (!task) {
        throw new NotFoundException("Task not found or does not belong to this workspace or project")
    }

    return { task };
}

//Service to delete task 
export const deleteTaskService = async (workspaceId: string, taskId: string) => {

    const task = await Task.findOneAndDelete({ _id: taskId, workspace: workspaceId });
    if (!task) {
        throw new NotFoundException("Task not found or does not belong to this workspace");
    }

    return;

}