import { z } from "zod"

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(255),
})

export type UserSchema = z.infer<typeof userSchema>
