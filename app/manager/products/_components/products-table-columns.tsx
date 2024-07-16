"use client"

import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/db/schema"
import type { ColumnDef } from "@tanstack/react-table"

export const productColumns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "isPublished",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.getValue("isPublished") ? "default" : "secondary"}>
        {row.getValue("isPublished") ? "Published" : "Archived"}
      </Badge>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    accessorFn: (product) => `${(product.price / 100).toFixed(2)} PLN`,
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    accessorFn: (product) => new Date(product.createdAt).toISOString(),
  },
]
