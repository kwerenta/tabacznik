"use client"

import { Button } from "@/components/ui/button"
import { checkout } from "@/lib/api/actions/stripe"
import { useCartStore } from "@/providers/cart-store-provider"
import { useAction } from "next-safe-action/hooks"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"

export function CheckoutButton() {
  const searchParams = useSearchParams()
  const successParam = searchParams.get("success")

  const products = useCartStore((state) => state.products)
  const clearCart = useCartStore((state) => state.clearCart)

  useEffect(() => {
    if (successParam === "1") {
      clearCart()
    }
  }, [successParam, clearCart])

  const { execute } = useAction(checkout, {
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
  })

  if (products.length === 0) return null

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
