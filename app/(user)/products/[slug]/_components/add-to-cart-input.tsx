"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCartStore } from "@/providers/cart-store-provider"
import type { CartProduct } from "@/stores/cart-store"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

interface AddToCartButtonProps {
  product: Omit<CartProduct, "quantity">
}

export function AddToCartInput({ product }: AddToCartButtonProps) {
  const router = useRouter()
  const addProductToCart = useCartStore((state) => state.addProduct)
  const [quantity, setQuantity] = useState(1)

  return (
    <>
      <div className="flex flex-col gap-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(e.currentTarget.valueAsNumber)}
        />
      </div>
      <Button
        onClick={() => {
          addProductToCart({ ...product, quantity })
          toast.success("Added product to cart!", {
            action: {
              label: "Go to cart",
              onClick: () => router.push("/cart"),
            },
          })
        }}
      >
        Add to cart
      </Button>
    </>
  )
}
