"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { RecentOrder } from "@/lib/api/queries/orders"
import {
  type RowSelectionState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useRouter, useSearchParams } from "next/navigation"
import { orderColumns } from "./order-table-columns"

interface OrderTableProps {
  data: RecentOrder[]
}

export function OrderTable({ data }: OrderTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const orderId = searchParams.get("order")
  const selectedRow = orderId
    ? data.findIndex((order) => order.id === orderId).toString()
    : "0"

  const rowSelection: RowSelectionState =
    selectedRow !== "-1"
      ? {
          [selectedRow]: true,
        }
      : {}

  const table = useReactTable({
    data,
    columns: orderColumns,
    getCoreRowModel: getCoreRowModel(),
    enableMultiRowSelection: false,
    onRowSelectionChange: (updater) => {
      const newSelectionValue =
        updater instanceof Function ? updater(rowSelection) : updater
      const rowId = Object.keys(newSelectionValue)[0] ?? "0"
      const { original: order } = table.getRow(rowId)
      router.replace(`/manager/orders?order=${order.id}`, { scroll: false })

      return newSelectionValue
    },
    state: {
      rowSelection,
    },
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                onClick={() => {
                  row.toggleSelected(true)
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={orderColumns.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
