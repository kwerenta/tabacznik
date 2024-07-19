"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteProduct } from "@/lib/api/actions/products"
import type { Product } from "@/lib/db/schema"
import { formatCurrency, formatNumber } from "@/lib/formatters"
import type { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { MoreHorizontal } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import Link from "next/link"
import { toast } from "sonner"

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
    accessorFn: (product) => formatCurrency(product.price),
  },
  {
    accessorKey: "stock",
    header: "Stock",
    accessorFn: (product) => formatNumber(product.stock),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    accessorFn: (product) => format(product.createdAt, "yyyy-MM-dd HH:ss"),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original

      const { execute: deleteAction } = useAction(deleteProduct, {
        onSuccess: () => {
          toast.success("Product deleted successfully!")
        },
        onError: ({ error }) => {
          toast.error(error.serverError)
        },
      })

      return (
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <Link href={`/manager/products/${product.id}/edit`}>
                <DropdownMenuItem>Edit</DropdownMenuItem>
              </Link>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. Are you sure you want to
                permanently delete this product from server?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteAction(product.id)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )
    },
  },
]
