import { db } from "@/lib/db"
import {
  type Order,
  orderedProducts,
  orders,
  products,
  users,
} from "@/lib/db/schema"
import { desc, eq, getTableColumns, sql } from "drizzle-orm"

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
