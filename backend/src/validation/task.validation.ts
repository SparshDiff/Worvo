import { z } from "zod";
import { TaskPriorityEnum, TaskStatusEnum } from "../enums/task.enums";

const titleSchema = z.string().trim().min(1).max(255);
const descriptionSchema = z.string().trim().optional();

const prioritySchema = z.enum(Object.values(TaskPriorityEnum) as [string, ...string[]]);
const statusSchema = z.enum(Object.values(TaskStatusEnum) as [string, ...string[]]);

const assignedToSchema = z.string().trim().min(1).nullable().optional();
const dueDateSchema = z
    .string()
    .trim()
    .optional()
    .refine(
        (val) => !val || !isNaN(Date.parse(val)),
        {
            message: "Invalid date format. Please provide a valid date string.",
        }
    );
export const taskIdSchema = z.string().trim().min(1);

export const createTaskSchema = z.object({
    title: titleSchema,
    description: descriptionSchema,
    priority: prioritySchema,
    status: statusSchema,
    assignedTo: assignedToSchema,
    dueDate: dueDateSchema
});

export const updateTaskSchema = z.object({
    title: titleSchema.optional(),
    description: descriptionSchema,
    priority: prioritySchema.optional(),
    status: statusSchema.optional(),
    assignedTo: assignedToSchema,
    dueDate: dueDateSchema
});