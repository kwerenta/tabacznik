import { sql } from "drizzle-orm"
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const users = sqliteTable("user", {
  id: text("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  passwordHash: text("password_hash").notNull(),
  isManager: integer("is_manager", { mode: "boolean" })
    .notNull()
    .default(false),
})
export type User = typeof users.$inferSelect

export const sessions = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at").notNull(),
})

export const products = sqliteTable("product", {
  id: integer("id").notNull().primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  description: text("description"),
  isPublished: integer("is_published", { mode: "boolean" })
    .notNull()
    .default(false),
  stock: integer("stock").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => new Date()),
})
export type Product = typeof products.$inferSelect

export const orders = sqliteTable("order", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => new Date()),
})
export type Order = typeof orders.$inferSelect

export const orderedProducts = sqliteTable(
  "ordered_product",
  {
    id: integer("id").notNull().primaryKey(),
    price: integer("price").notNull(),
    quantity: integer("quantity").notNull(),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
  },
  (table) => ({
    orderIndex: index("order_index").on(table.orderId),
  }),
)
export type OrderedProduct = typeof orderedProducts.$inferSelect
