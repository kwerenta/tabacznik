import { z } from "zod"

export const newProductSchema = z.object({
  name: z.string().min(3).max(255),
  description: z.string().min(3).max(1023).nullable(),
  price: z.number().min(0),
  stock: z.number().min(0),
  isPublished: z.boolean(),
})

export type NewProduct = z.infer<typeof newProductSchema>
