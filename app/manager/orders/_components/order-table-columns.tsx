"use client"

import type { Order, User } from "@/lib/db/schema"
import { formatCurrency } from "@/lib/formatters"
import type { ColumnDef } from "@tanstack/react-table"
import { formatISO } from "date-fns"

export const orderColumns: ColumnDef<Order & { user: User; total: number }>[] =
  [
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
      accessorKey: "total",
      header: "Amount",
      accessorFn: (order) => formatCurrency(order.total),
    },
  ]
