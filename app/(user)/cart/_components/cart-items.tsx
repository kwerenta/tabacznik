"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCartStore } from "@/providers/cart-store-provider"
import { ImageOff, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function CartItems() {
  const products = useCartStore((state) => state.products)
  const removeProduct = useCartStore((state) => state.removeProduct)
  const updateQuantity = useCartStore((state) => state.updateQuantity)

  if (products.length === 0)
    return (
      <div className="border-dashed border p-6 flex flex-col justify-center items-center w-full gap-6">
        <p className="text-xl">Cart is empty.</p>
        <Link href="/products" className={buttonVariants()}>
          Find products
        </Link>
      </div>
    )

  return (
    <div className="flex flex-col gap-4 w-full">
      {products.map((product) => (
        <div
          key={product.id}
          className="flex gap-4 items-center justify-between"
        >
          <Link
            href={`/products/${product.slug}`}
            className="flex gap-4 flex-1 items-center"
          >
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt="Product image"
                width={128}
                height={128}
                className="aspect-square object-cover rounded-md"
              />
            ) : (
              <div className="w-32 rounded-md grid place-items-center border border-dashed">
                <ImageOff className="w-full h-full p-2 stroke-1" />
                <span className="sr-only">No image</span>
              </div>
            )}
            <h3 className="text-lg">{product.name}</h3>
          </Link>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={product.quantity}
              min={1}
              onChange={(e) =>
                updateQuantity(product.id, e.currentTarget.valueAsNumber)
              }
            />
            <Button
              size="icon"
              variant="destructive"
              className="shrink-0"
              onClick={() => removeProduct(product.id)}
            >
              <Trash2 className="size-4" />
              <span className="sr-only">Delete product from cart</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
