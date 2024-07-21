"use client"

import { DeleteConfirmationDialogContent } from "@/components/delete-confirmation-dialog-content"
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { deleteOrder } from "@/lib/api/actions/orders"
import type { Order } from "@/lib/db/schema"
import { Trash2 } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface DeleteOrderButtonProps {
  orderId: Order["id"]
}

export function DeleteOrderButton({ orderId }: DeleteOrderButtonProps) {
  const router = useRouter()

  const { execute } = useAction(deleteOrder, {
    onSuccess: () => {
      router.replace("/manager/orders")
      toast.success("Order deleted successfully!")
    },
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
  })

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="icon" variant="outline" className="h-8 w-8">
          <Trash2 className="h-3.5 w-3.5" />
          <span className="sr-only">Delete</span>
        </Button>
      </AlertDialogTrigger>
      <DeleteConfirmationDialogContent
        subject="order"
        deleteAction={() => execute(orderId)}
      />
    </AlertDialog>
  )
}
