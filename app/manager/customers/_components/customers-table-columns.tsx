"use client"

import { DeleteConfirmationDialogContent } from "@/components/delete-confirmation-dialog-content"
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteCustomer } from "@/lib/api/actions/users"
import type { User } from "@/lib/db/schema"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

export const customerColumns: ColumnDef<Omit<User, "passwordHash">>[] = [
  {
    accessorKey: "firstName",
    header: "First name",
  },
  {
    accessorKey: "lastName",
    header: "Last name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const customer = row.original

      const { execute: deleteAction } = useAction(deleteCustomer, {
        onSuccess: () => {
          toast.success("Customer deleted successfully!")
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
              <AlertDialogTrigger asChild>
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DeleteConfirmationDialogContent
            subject="customer"
            deleteAction={() => deleteAction(customer.id)}
          />
        </AlertDialog>
      )
    },
  },
]
