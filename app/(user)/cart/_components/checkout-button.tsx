"use client"

import { Button } from "@/components/ui/button"
import { checkout } from "@/lib/api/actions/stripe"
import { useCartStore } from "@/providers/cart-store-provider"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

export function CheckoutButton() {
  const products = useCartStore((state) => state.products)

  const { execute } = useAction(checkout, {
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
  })
  return (
    <Button
      onClick={() =>
        execute({
          products: products.map((product) => ({
            id: product.id,
            quantity: product.quantity,
          })),
        })
      }
    >
      Checkout
    </Button>
  )
}
