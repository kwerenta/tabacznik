"use client"

import { Button } from "@/components/ui/button"
import type { Order } from "@/lib/db/schema"
import { Copy } from "lucide-react"
import { toast } from "sonner"

interface CopyOrderIdButtonProps {
  orderId: Order["id"]
}

export function CopyOrderIdButton({ orderId }: CopyOrderIdButtonProps) {
  return (
    <Button
      size="icon"
      variant="outline"
      className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
      onClick={() => {
        navigator.clipboard.writeText(orderId)
        toast.info("Order ID copied to clipboard")
      }}
    >
      <Copy className="h-3 w-3" />
      <span className="sr-only">Copy Order ID</span>
    </Button>
  )
}
