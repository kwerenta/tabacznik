import { db } from "@/lib/db"
import { orderedProducts, orders, products } from "@/lib/db/schema"
import { stripe } from "@/lib/stripe"
import { type SQL, eq, inArray, sql } from "drizzle-orm"
import { headers } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import type Stripe from "stripe"

export const POST = async (req: NextRequest) => {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature")

  if (!signature)
    return new NextResponse("Stripe signature is missing", { status: 400 })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET ?? "",
    )
  } catch (_) {
    return new NextResponse("Failed to construct webhook event", {
      status: 400,
    })
  }

  const session = event.data.object as Stripe.Checkout.Session

  if (event.type === "checkout.session.completed") {
    const orderId = session?.metadata?.orderId

    if (!orderId) return new NextResponse("Invalid order", { status: 400 })

    const boughtProducts = await db
      .select({
        id: orderedProducts.productId,
        quantity: orderedProducts.quantity,
      })
      .from(orderedProducts)
      .where(eq(orderedProducts.orderId, orderId))

    const setSQL: SQL[] = [sql`(CASE`]
    for (const product of boughtProducts) {
      setSQL.push(
        sql`WHEN ${products.id} = ${product.id} THEN ${products.stock} - ${product.quantity}`,
      )
    }
    setSQL.push(sql`END)`)

    await db.transaction(async (tx) => {
      await tx
        .update(orders)
        .set({ isPaid: true })
        .where(eq(orders.id, orderId))

      await tx
        .update(products)
        .set({ stock: sql.join(setSQL, sql.raw(" ")) })
        .where(
          inArray(
            products.id,
            boughtProducts.map((product) => product.id),
          ),
        )
    })
  }

  return new NextResponse(null, { status: 200 })
}
