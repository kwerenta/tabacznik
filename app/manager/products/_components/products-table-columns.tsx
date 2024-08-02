"use client"

import { DeleteConfirmationDialogContent } from "@/components/delete-confirmation-dialog-content"
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useBasicAction } from "@/hooks/use-basic-action"
import { deleteProduct } from "@/lib/api/actions/products"
import type { Product } from "@/lib/db/schema"
import { formatCurrency, formatNumber } from "@/lib/formatters"
import type { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { ImageOff, MoreHorizontal } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export const productColumns: ColumnDef<
  Product & { imageUrl: string | null }
>[] = [
  {
    id: "image",
    size: 64,
    cell: ({ row }) => {
      const product = row.original

      if (!product.imageUrl)
        return (
          <div className="size-16 rounded-md grid place-items-center border border-dashed">
            <ImageOff className="w-full h-full p-4" />
          </div>
        )

      return (
        <Image
          src={product.imageUrl}
          alt={`Image of ${product.name}`}
          width={64}
          height={64}
          className="aspect-square rounded-md object-cover"
        />
      )
    },
  },
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

      const { execute: deleteAction } = useBasicAction(
        deleteProduct,
        "Product deleted successfully!",
      )

      return (
        <AlertDialog>
          <DropdownMenu>
            <div className="text-right">
              <DropdownMenuTrigger asChild>
                <Button aria-haspopup="true" size="icon" variant="ghost">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DropdownMenuTrigger>
            </div>
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
          <DeleteConfirmationDialogContent
            subject="product"
            deleteAction={() => deleteAction(product.id)}
          />
        </AlertDialog>
      )
    },
  },
]
