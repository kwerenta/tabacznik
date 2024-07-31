"use client"

import { Button } from "@/components/ui/button"
import { useCartStore } from "@/providers/cart-store-provider"
import { Trash } from "lucide-react"

export function ClearCartButton() {
  const products = useCartStore((state) => state.products)
  const clearCart = useCartStore((state) => state.clearCart)

  if (products.length === 0) return null

  return (
    <Button
      variant="outline"
      className="absolute right-0 top-0"
      onClick={clearCart}
    >
      <Trash className="size-4 mr-2" />
      Clear cart
    </Button>
  )
}
