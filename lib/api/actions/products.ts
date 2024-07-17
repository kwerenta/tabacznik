"use server"

import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"
import {
  editProductSchema,
  newProductSchema,
  productIdSchema,
} from "@/lib/validations/products"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { managerActionClient } from ".."

export const createProduct = managerActionClient
  .schema(newProductSchema)
  .action(async ({ parsedInput: newProduct }) => {
    // TODO: Add proper slug generation
    const slug = newProduct.name.toLowerCase().replace(/\s+/g, "-")

    await db.insert(products).values({ slug, ...newProduct })
    return redirect("/manager/products")
  })

export const editProduct = managerActionClient
  .schema(editProductSchema)
  .action(async ({ parsedInput: newProduct }) => {
    // TODO: Add slug validation and updating
    await db
      .update(products)
      .set({ ...newProduct })
      .where(eq(products.id, newProduct.id))
    return redirect("/manager/products")
  })

export const deleteProduct = managerActionClient
  .schema(productIdSchema)
  .action(async ({ parsedInput: productId }) => {
    await db.delete(products).where(eq(products.id, productId))

    return revalidatePath("/manager/products")
  })
