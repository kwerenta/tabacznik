import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq, getTableColumns } from "drizzle-orm"

export async function getCustomers() {
  const { passwordHash, ...selectedColumns } = getTableColumns(users)
  return await db
    .select(selectedColumns)
    .from(users)
    .where(eq(users.isManager, false))
}
