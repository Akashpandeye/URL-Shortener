import { z } from "zod";

export const signupPostRequestSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    password: z.string().min(3),
})

