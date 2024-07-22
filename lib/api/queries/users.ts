import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { getStatsQuery } from "@/lib/utils"
import { subDays } from "date-fns"
import { and, eq, getTableColumns, gte, sum } from "drizzle-orm"

export async function getCustomers() {
  const { passwordHash, ...selectedColumns } = getTableColumns(users)
  return await db
    .select(selectedColumns)
    .from(users)
    .where(eq(users.isManager, false))
}

export async function getCustomersStats() {
  const customersCount = (type: "last" | "previous", days: number) =>
    sum(getStatsQuery(users.createdAt, type, days)).mapWith(Number)

  const [result] = await db
    .select({
      last28Days: customersCount("last", 28),
      previous28Days: customersCount("previous", 28),
    })
    .from(users)
    .where(
      and(
        eq(users.isManager, false),
        gte(users.createdAt, subDays(new Date(), 2 * 4 * 7)),
      ),
    )
  return result
}
