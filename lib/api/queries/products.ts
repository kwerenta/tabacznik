import { db } from "@/lib/db"
import {
  type Product,
  orderedProducts,
  productImages,
  products,
} from "@/lib/db/schema"
import { and, asc, desc, eq, getTableColumns, sql, sum } from "drizzle-orm"

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

export async function getProductBySlug(slug: Product["slug"]) {
  const result = await db
    .select({
      product: products,
      imageUrl: productImages.url,
    })
    .from(products)
    .where(and(eq(products.slug, slug), eq(products.isPublished, true)))
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

export async function getPopularProducts() {
  return await db
    .select({ ...getTableColumns(products), imageUrl: productImages.url })
    .from(products)
    .leftJoin(
      productImages,
      and(eq(products.id, productImages.productId), eq(productImages.order, 0)),
    )
    .innerJoin(orderedProducts, eq(products.id, orderedProducts.productId))
    .where(eq(products.isPublished, true))
    .groupBy(products.id)
    .orderBy(
      desc(sum(sql`${orderedProducts.price} * ${orderedProducts.quantity}`)),
      desc(products.createdAt),
    )
    .limit(5)
}

export async function getNewProducts() {
  return await db
    .select({ ...getTableColumns(products), imageUrl: productImages.url })
    .from(products)
    .leftJoin(
      productImages,
      and(eq(products.id, productImages.productId), eq(productImages.order, 0)),
    )
    .where(eq(products.isPublished, true))
    .orderBy(desc(products.createdAt))
    .limit(5)
}
