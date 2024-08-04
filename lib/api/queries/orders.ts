import { db } from "@/lib/db"
import {
  type Order,
  orderedProducts,
  orders,
  products,
  users,
} from "@/lib/db/schema"
import { getStatsQuery } from "@/lib/utils"
import { startOfMonth, subDays, subWeeks, subYears } from "date-fns"
import { and, asc, desc, eq, getTableColumns, gte, sql, sum } from "drizzle-orm"

export async function getRecentOrders() {
  const { isManager, passwordHash, ...userColumns } = getTableColumns(users)
  return await db
    .select({
      ...getTableColumns(orders),
      user: userColumns,
      total:
        sql`sum(${orderedProducts.price} * ${orderedProducts.quantity})`.mapWith(
          Number,
        ),
    })
    .from(orders)
    .innerJoin(users, eq(orders.userId, users.id))
    .innerJoin(orderedProducts, eq(orders.id, orderedProducts.orderId))
    .orderBy(desc(orders.createdAt))
    .groupBy(orderedProducts.orderId)
    .limit(10)
}
export type RecentOrder = Awaited<ReturnType<typeof getRecentOrders>>[number]

export async function getOrderDetails(orderId: Order["id"]) {
  const { isManager, passwordHash, ...userColumns } = getTableColumns(users)
  const result = await db
    .select({
      ...getTableColumns(orders),
      user: userColumns,
      product: {
        name: products.name,
        slug: products.slug,
        price: orderedProducts.price,
        quantity: orderedProducts.quantity,
      },
    })
    .from(orders)
    .innerJoin(users, eq(orders.userId, users.id))
    .innerJoin(orderedProducts, eq(orders.id, orderedProducts.orderId))
    .innerJoin(products, eq(orderedProducts.productId, products.id))
    .where(eq(orders.id, orderId))

  const order = result[0]
  if (!order) return null

  return {
    id: order.id,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    user: order.user,
    products: result.map(({ product }) => product),
  }
}
export type OrderDetails = Awaited<ReturnType<typeof getOrderDetails>>

export async function getRevenueStats(shouldIncludeLastWeek = true) {
  const revenueSum = (type: "last" | "previous", days: number) =>
    sum(
      getStatsQuery(
        orders.createdAt,
        type,
        days,
        sql`${orderedProducts.price} * ${orderedProducts.quantity}`,
      ),
    ).mapWith(Number)

  const [result] = await db
    .select({
      ...(shouldIncludeLastWeek && {
        last7Days: revenueSum("last", 7),
        previous7Days: revenueSum("previous", 7),
      }),
      last28Days: revenueSum("last", 28),
      previous28Days: revenueSum("previous", 28),
    })
    .from(orders)
    .innerJoin(orderedProducts, eq(orders.id, orderedProducts.orderId))
    .where(
      and(
        gte(orders.createdAt, subDays(new Date(), 2 * 4 * 7)),
        eq(orders.isPaid, true),
      ),
    )

  return result
}

export async function getSalesStats() {
  const salesCount = (type: "last" | "previous", days: number) =>
    sum(
      getStatsQuery(
        orders.createdAt,
        type,
        days,
        sql`${orderedProducts.quantity}`,
      ),
    ).mapWith(Number)

  const [result] = await db
    .select({
      last28Days: salesCount("last", 28),
      previous28Days: salesCount("previous", 28),
    })
    .from(orders)
    .innerJoin(orderedProducts, eq(orders.id, orderedProducts.orderId))
    .where(
      and(
        gte(orders.createdAt, subDays(new Date(), 2 * 4 * 7)),
        eq(orders.isPaid, true),
      ),
    )

  return result
}

export async function getRecentSales() {
  return await db
    .select({
      name: products.name,
      quantity: orderedProducts.quantity,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .innerJoin(orderedProducts, eq(orders.id, orderedProducts.orderId))
    .innerJoin(products, eq(orderedProducts.productId, products.id))
    .where(eq(orders.isPaid, true))
    .orderBy(desc(orders.createdAt))
    .limit(10)
}
export type RecentSale = Awaited<ReturnType<typeof getRecentSales>>[number]

export async function getLastYearRevenueByMonth() {
  const month = sql`strftime('%m', ${orders.createdAt}, 'auto')`
  const year = sql`strftime('%Y', ${orders.createdAt}, 'auto')`

  const result = await db
    .select({
      date: sql`strftime('%Y-%m', ${orders.createdAt}, 'auto')`.mapWith(String),
      revenue:
        sql`sum(${orderedProducts.price} * ${orderedProducts.quantity})`.mapWith(
          Number,
        ),
    })
    .from(orders)
    .innerJoin(orderedProducts, eq(orders.id, orderedProducts.orderId))
    .where(
      and(
        gte(orders.createdAt, subYears(new Date(), 1)),
        eq(orders.isPaid, true),
      ),
    )
    .groupBy(year, month)
    .orderBy(asc(year), asc(month))

  return result
}

export async function getAverageMonthRevenue() {
  const year = sql`strftime('%Y', ${orders.createdAt}, 'auto')`

  const result = await db
    .select({
      year: year.mapWith(String),
      revenue:
        sql`sum(${orderedProducts.price} * ${orderedProducts.quantity})`.mapWith(
          Number,
        ),
    })
    .from(orders)
    .innerJoin(orderedProducts, eq(orders.id, orderedProducts.orderId))
    .where(
      and(
        gte(orders.createdAt, subYears(new Date(), 2)),
        eq(orders.isPaid, true),
      ),
    )
    .groupBy(year)
    .limit(2)

  return result.map((entry) => ({ ...entry, revenue: entry.revenue / 12 }))
}

export async function getWeekSalesCount() {
  const date = sql`strftime('%F', ${orders.createdAt}, 'auto')`

  const result = await db
    .select({
      date: date.mapWith(String),
      sales: sum(orderedProducts.quantity).mapWith(Number),
    })
    .from(orders)
    .innerJoin(orderedProducts, eq(orders.id, orderedProducts.orderId))
    .where(
      and(
        gte(orders.createdAt, subWeeks(new Date(), 1)),
        eq(orders.isPaid, true),
      ),
    )
    .groupBy(date)
    .limit(7)

  return result
}

export async function getBestSellingProducts() {
  const result = await db
    .select({
      product: products.name,
      sales: sum(orderedProducts.quantity).mapWith(Number),
    })
    .from(orders)
    .innerJoin(orderedProducts, eq(orders.id, orderedProducts.orderId))
    .innerJoin(products, eq(orderedProducts.productId, products.id))
    .where(
      and(
        gte(orders.createdAt, startOfMonth(new Date())),
        eq(orders.isPaid, true),
      ),
    )
    .groupBy(products.id)
    .orderBy(desc(sum(orderedProducts.quantity)))
    .limit(5)

  return result
}

export async function getMonthTotalSales() {
  const [result] = await db
    .select({ total: sum(orderedProducts.quantity).mapWith(Number) })
    .from(orders)
    .innerJoin(orderedProducts, eq(orders.id, orderedProducts.orderId))
    .where(
      and(
        gte(orders.createdAt, startOfMonth(new Date())),
        eq(orders.isPaid, true),
      ),
    )

  return result?.total
}
