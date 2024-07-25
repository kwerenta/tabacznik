import { z } from "zod"

export const MAX_PRODUCT_IMAGES = 4

export const productIdSchema = z.number()

export const newProductSchema = z.object({
  name: z.string().min(3).max(255),
  description: z.string().min(3).max(1023).nullable(),
  price: z.number().min(0),
  stock: z.number().min(0),
  isPublished: z.boolean(),
  imageUrls: z.array(z.string().url()).min(0).max(MAX_PRODUCT_IMAGES),
})
export type NewProductValues = z.infer<typeof newProductSchema>

export const editProductSchema = newProductSchema.extend({
  id: productIdSchema,
})
