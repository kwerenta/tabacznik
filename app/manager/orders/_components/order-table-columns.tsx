"use client"

import type { Order, User } from "@/lib/db/schema"
import type { ColumnDef } from "@tanstack/react-table"

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
      accessorFn: (order) => order.createdAt.toISOString(),
    },
    {
      accessorKey: "total",
      header: "Amount",
      accessorFn: (order) => `$${(order.total / 100).toFixed(2)}`,
    },
  ]
