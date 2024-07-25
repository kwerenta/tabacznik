"use server"

import { db } from "@/lib/db"
import { productImages, products } from "@/lib/db/schema"
import {
  MAX_PRODUCT_IMAGES,
  editProductSchema,
  newProductSchema,
  productIdSchema,
} from "@/lib/validations/products"
import { and, eq, gte, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { managerActionClient } from ".."

export const createProduct = managerActionClient
  .schema(newProductSchema)
  .action(async ({ parsedInput: { imageUrls, ...newProduct } }) => {
    // TODO: Add proper slug generation
    const slug = newProduct.name.toLowerCase().replace(/\s+/g, "-")

    await db.transaction(async (tx) => {
      const [insertedProduct] = await tx
        .insert(products)
        .values({ slug, ...newProduct })
        .returning({ id: products.id })

      if (!insertedProduct) return tx.rollback()

      if (imageUrls.length === 0) return

      await tx.insert(productImages).values(
        imageUrls.map((url, index) => ({
          url,
          productId: insertedProduct.id,
          order: index,
        })),
      )
    })
    return redirect("/manager/products")
  })

export const editProduct = managerActionClient
  .schema(editProductSchema)
  .action(async ({ parsedInput: { imageUrls, ...newProduct } }) => {
    // TODO: Add slug validation (and ask if should change slug after product name change) and updating

    await db.transaction(async (tx) => {
      await tx
        .update(products)
        .set({ ...newProduct })
        .where(eq(products.id, newProduct.id))

      if (imageUrls.length > 0) {
        await tx
          .insert(productImages)
          .values(
            imageUrls.map((url, index) => ({
              url,
              productId: newProduct.id,
              order: index,
            })),
          )
          .onConflictDoUpdate({
            target: [productImages.productId, productImages.order],
            set: {
              url: sql`excluded.url`,
            },
          })
      }

      if (imageUrls.length <= MAX_PRODUCT_IMAGES) {
        await tx
          .delete(productImages)
          .where(
            and(
              eq(productImages.productId, newProduct.id),
              gte(productImages.order, imageUrls.length),
            ),
          )
      }
    })
    return redirect("/manager/products")
  })

export const deleteProduct = managerActionClient
  .schema(productIdSchema)
  .action(async ({ parsedInput: productId }) => {
    await db.delete(products).where(eq(products.id, productId))

    return revalidatePath("/manager/products")
  })
