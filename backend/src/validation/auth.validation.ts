import { z } from "zod";

const emailSchema = z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address")
    .min(3)
    .max(255);

const passwordSchema = z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters long")
    .max(100,"Password must be at most 100 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");


export const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1)
        .max(255),
    email: emailSchema,
    password: passwordSchema
});

export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema
})