"use server"

import { db } from "@/lib/db"
import {
  orderedProducts,
  orders,
  productImages,
  products,
} from "@/lib/db/schema"
import { stripe } from "@/lib/stripe"
import { cartItemsSchema } from "@/lib/validations/orders"
import { and, eq, inArray } from "drizzle-orm"
import { generateIdFromEntropySize } from "lucia"
import { redirect } from "next/navigation"
import type Stripe from "stripe"
import { ActionError, authActionClient } from ".."

export const checkout = authActionClient
  .schema(cartItemsSchema)
  .action(
    async ({ parsedInput: { products: cartProducts }, ctx: { user } }) => {
      const dbProducts = await db
        .select({
          id: products.id,
          name: products.name,
          price: products.price,
          imageUrl: productImages.url,
        })
        .from(products)
        .leftJoin(
          productImages,
          and(
            eq(products.id, productImages.productId),
            eq(productImages.order, 0),
          ),
        )
        .where(
          inArray(
            products.id,
            cartProducts.map((product) => product.id),
          ),
        )

      // TODO: Validate if products are in stock

      if (dbProducts.length !== cartProducts.length)
        throw new ActionError("Invalid products")

      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
        dbProducts.map((product) => {
          const quantity =
            cartProducts.find((cartProduct) => product.id === cartProduct.id)
              ?.quantity ?? 0

          return {
            quantity,
            price_data: {
              currency: "USD",
              unit_amount: product.price,
              product_data: {
                name: product.name,
                images: product.imageUrl ? [product.imageUrl] : undefined,
              },
            },
          }
        })

      const orderId = generateIdFromEntropySize(10)
      await db.transaction(async (tx) => {
        await tx.insert(orders).values({
          id: orderId,
          userId: user.id,
        })

        await tx.insert(orderedProducts).values(
          dbProducts.map((product) => {
            const quantity =
              cartProducts.find((cartProduct) => product.id === cartProduct.id)
                ?.quantity ?? 0

            return {
              orderId,
              price: product.price,
              productId: product.id,
              quantity,
            }
          }),
        )
      })

      const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: "payment",
        customer_email: user.email,
        billing_address_collection: "required",
        success_url: "http://localhost:3000/cart?success=1",
        cancel_url: "http://localhost:3000/cart?success=0",
        metadata: {
          orderId,
        },
      })

      redirect(session.url ?? "http://localhost:3000/cart")
    },
  )
