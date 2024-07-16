import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"

export async function getAllProducts() {
  return await db.select().from(products)
}
