import { z } from "zod";

export const UserTokenValidationSchema = z.object({
    id: z.string()
})
