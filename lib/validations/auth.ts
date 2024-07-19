import { z } from "zod"

export const userCredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(255),
})
export type UserCredentialsValues = z.infer<typeof userCredentialsSchema>

export const newUserSchema = userCredentialsSchema.merge(
  z.object({
    firstName: z.string().min(1).max(50),
    lastName: z.string().min(1).max(50),
    phone: z.string().length(9),
  }),
)
export type NewUserValues = z.infer<typeof newUserSchema>
