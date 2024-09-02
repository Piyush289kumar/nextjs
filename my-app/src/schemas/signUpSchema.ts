import { z } from 'zod'

export const usernameValidation = z
    .string()
    .min(2, { message: "Minimum 2 characters required" })
    .max(20, { message: "Maximum 20 characters allowed" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Special characters are not allowed" });

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" })
});