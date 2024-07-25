import { db } from "@/lib/db"
import {
  type Product,
  type ProductImage,
  productImages,
  products,
} from "@/lib/db/schema"
import { asc, eq } from "drizzle-orm"

export async function getAllProducts() {
  return await db.select().from(products)
}

export async function getProductById(id: Product["id"]) {
  const result = await db
    .select({
      product: products,
      imageUrl: productImages.url,
    })
    .from(products)
    .where(eq(products.id, id))
    .leftJoin(productImages, eq(products.id, productImages.productId))
    .orderBy(asc(productImages.order))

  const entry = result[0]
  if (!entry) return null

  return {
    ...entry.product,
    imageUrls: result
      .filter(
        (entry): entry is { product: Product; imageUrl: string } =>
          entry.imageUrl !== null,
      )
      .map(({ imageUrl }) => imageUrl),
  }
}
