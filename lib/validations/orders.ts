import { z } from "zod"

export const orderIdSchema = z.string()

export const cartItemsSchema = z.object({
  products: z
    .array(
      z.object({
        id: z.number(),
        quantity: z.number().min(1),
      }),
    )
    .min(1),
})
