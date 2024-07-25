import { db } from "@/lib/db"
import { type Product, productImages, products } from "@/lib/db/schema"
import { and, asc, eq, getTableColumns } from "drizzle-orm"

export async function getAllProducts() {
  return await db
    .select({ ...getTableColumns(products), imageUrl: productImages.url })
    .from(products)
    .leftJoin(
      productImages,
      and(eq(products.id, productImages.productId), eq(productImages.order, 0)),
    )
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
