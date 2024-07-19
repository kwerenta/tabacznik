"use server"

import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { userIdSchema } from "@/lib/validations/auth"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { ActionError, managerActionClient } from ".."

export const deleteCustomer = managerActionClient
  .schema(userIdSchema)
  .action(async ({ parsedInput: userId }) => {
    const result = await db
      .delete(users)
      .where(and(eq(users.id, userId), eq(users.isManager, false)))

    if (result.rowsAffected === 0)
      throw new ActionError("Selected customer does not exist")

    revalidatePath("/manager/customers")
  })
