import { db } from "@/lib/db"
import {
  type Order,
  orderedProducts,
  orders,
  products,
  users,
} from "@/lib/db/schema"
import { subDays } from "date-fns"
import { desc, eq, getTableColumns, gte, sql, sum } from "drizzle-orm"

export async function getRecentOrders() {
  return await db
    .select({
      ...getTableColumns(orders),
      user: users,
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

export async function getOrderDetails(orderId: Order["id"]) {
  const result = await db
    .select({
      ...getTableColumns(orders),
      user: users,
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

export async function getRevenueStats() {
  const revenueSum = (type: "last" | "previous", days: number) => {
    const query = sql.empty()
    query
      .append(sql`CASE WHEN DATE(${orders.createdAt}, 'auto') `)
      .append(
        sql`>= DATE('now', '-${sql.raw(`${(type === "last" ? 1 : 2) * days}`)} days') `,
      )
    if (type === "previous") query.append(sql`< DATE('now', '-${days} days') `)
    query.append(
      sql`THEN ${orderedProducts.price} * ${orderedProducts.quantity} ELSE 0 END`,
    )
    return sum(query).mapWith(Number)
  }

  const [result] = await db
    .select({
      last7Days: revenueSum("last", 7),
      previous7Days: revenueSum("previous", 7),
      last28Days: revenueSum("last", 28),
      previous28Days: revenueSum("previous", 28),
    })
    .from(orders)
    .innerJoin(orderedProducts, eq(orders.id, orderedProducts.orderId))
    .where(gte(orders.createdAt, subDays(new Date(), 2 * 4 * 7)))

  return result
}
