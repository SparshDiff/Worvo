import { z } from "zod";

const emojiSchema = z.string().trim().optional();
const nameSchema = z.string().trim().min(1, "Project name is required").max(255, "Project name must be at most 255 characters");
const descriptionSchema = z.string().trim().optional();

export const createProjectSchema = z.object({
    emoji: emojiSchema,
    name: nameSchema,
    description: descriptionSchema
});
export const updateProjectSchema = z.object({
    emoji: emojiSchema,
    name: nameSchema.optional(),
    description: descriptionSchema
});

export const projectIdSchema = z.string().trim().min(1, "Project ID is required");