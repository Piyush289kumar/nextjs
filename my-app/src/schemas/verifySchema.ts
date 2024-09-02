import { z } from 'zod'

export const verifySchema = z.object({
    code: z.string().min(6, { message: "Must be at least 6 digits" }),
})
