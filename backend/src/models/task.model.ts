import mongoose, { Document, Schema } from "mongoose";
import { TaskPriorityEnum, TaskPriorityEnumType, TaskStatusEnum, TaskStatusEnumType } from "../enums/task.enums";
import { generateTaskCode } from "../utils/uuid";

export interface TaskDocument extends Document {
    taskcode: string;
    title: string;
    description: string | null;
    workspace: mongoose.Types.ObjectId;
    project: mongoose.Types.ObjectId;
    status: TaskStatusEnumType;
    priority: TaskPriorityEnumType;
    assignedTo: mongoose.Types.ObjectId | null;
    createdBy: mongoose.Types.ObjectId;
    dueDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

const taskSchema = new Schema<TaskDocument>(
    {
        taskcode: {
            type: String,
            unique: true,
            default: generateTaskCode
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            default: null,
            trim: true,
        },

        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },

        workspace: {
            type: Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
        },

        status: {
            type: String,
            enum: Object.values(TaskStatusEnum),
            default: TaskStatusEnum.TODO
        },

        priority: {
            type: String,
            enum: Object.values(TaskPriorityEnum),
            required: true,
            default: TaskPriorityEnum.MEDIUM
        },

        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        dueDate: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

taskSchema.index({
    workspace: 1,
    project: 1,
    status: 1,
    priority: 1,
});

taskSchema.index({
    workspace: 1,
    assignedTo: 1,
});




export const Task = mongoose.model<TaskDocument>("Task", taskSchema);