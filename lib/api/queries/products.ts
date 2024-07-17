import { db } from "@/lib/db"
import { type Product, products } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function getAllProducts() {
  return await db.select().from(products)
}

export async function getProductById(id: Product["id"]) {
  return await db.select().from(products).where(eq(products.id, id)).limit(1)
}
