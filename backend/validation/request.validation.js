import { z } from "zod";

export const signupPostRequestSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
});

export const loginPostRequestSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

export const shortendPostRequestBodySchema = z.object({
    url: z.string().url(),
    code: z.string().optional(),
});
