"use client"

import type { RecentSale } from "@/lib/api/queries/orders"
import type { ColumnDef } from "@tanstack/react-table"
import { formatISO } from "date-fns"

export const recentSaleColumns: ColumnDef<RecentSale>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    accessorFn: (sale) => formatISO(sale.createdAt, { representation: "date" }),
  },
]
