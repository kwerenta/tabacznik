"use client"

import { Badge } from "@/components/ui/badge"
import type { RecentOrder } from "@/lib/api/queries/orders"
import { formatCurrency } from "@/lib/formatters"
import type { ColumnDef } from "@tanstack/react-table"
import { formatISO } from "date-fns"

export const orderColumns: ColumnDef<RecentOrder>[] = [
  {
    id: "customer",
    header: "Customer",
    cell: ({ row }) => {
      const order = row.original

      return (
        <>
          <div className="font-medium">
            {order.user.firstName} {order.user.lastName}
          </div>
          <div className="hidden text-sm text-muted-foreground md:inline">
            {order.user.email}
          </div>
        </>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    accessorFn: (order) =>
      formatISO(order.createdAt, { representation: "date" }),
  },
  {
    accessorKey: "isPaid",
    cell: ({ row }) => {
      const order = row.original
      return (
        <Badge variant={order.isPaid ? "default" : "secondary"}>
          {order.isPaid ? "Paid" : "Not paid"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "total",
    header: "Amount",
    accessorFn: (order) => formatCurrency(order.total),
  },
]
