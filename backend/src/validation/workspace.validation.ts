import { z } from "zod";

const nameSchema = z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(255);

const descriptionSchema = z
    .string()
    .trim()
    .optional();

export const createWorkspaceSchema = z.object({
    name: nameSchema,
    description: descriptionSchema
});
export const updateWorkspaceSchema = z.object({
    name: nameSchema.optional(),
    description: descriptionSchema
});

export const workspaceIdSchema = z
    .string()
    .trim()
    .min(1, "Workspace ID is required");

export const changeMemberRoleSchema = z.object({
    memberId: z.string().trim().min(1, "Member ID is required"),
    newRoleId: z.string().trim().min(1, "New Role ID is required")
});