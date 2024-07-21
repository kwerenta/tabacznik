"use server"

import { db } from "@/lib/db"
import { orders } from "@/lib/db/schema"
import { orderIdSchema } from "@/lib/validations/orders"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { managerActionClient } from ".."

export const deleteOrder = managerActionClient
  .schema(orderIdSchema)
  .action(async ({ parsedInput: orderId }) => {
    await db.delete(orders).where(eq(orders.id, orderId))

    return revalidatePath("/manager/orders")
  })
