"use client"

import { useCartStore } from "@/providers/cart-store-provider"
import { ImageOff, ShoppingBasket } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button, buttonVariants } from "./ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

export function CartHeaderButton() {
  const products = useCartStore((state) => state.products)

  return (
    <Tooltip>
      <HoverCard openDelay={0}>
        <TooltipTrigger asChild>
          <HoverCardTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative shrink-0"
              asChild
            >
              <Link href="#">
                {products.length > 0 && (
                  <div className="absolute bg-primary text-primary-foreground top-0 right-0 size-[18px] flex justify-center items-center rounded-full text-xs">
                    {products.length}
                  </div>
                )}
                <ShoppingBasket className="size-5" />
                <span className="sr-only">Cart</span>
              </Link>
            </Button>
          </HoverCardTrigger>
        </TooltipTrigger>
        <TooltipContent>Cart</TooltipContent>
        <HoverCardContent>
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Cart</h4>
              <p className="text-sm text-muted-foreground">
                {products.length === 0
                  ? "Cart is empty."
                  : "View what is in your cart."}
              </p>
            </div>
            {products.length > 0 && (
              <>
                <div className="flex flex-col gap-2">
                  {products.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className="flex gap-2"
                    >
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt="Product image"
                          width={64}
                          height={64}
                          className="aspect-square object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-16 rounded-md grid place-items-center border border-dashed">
                          <ImageOff className="w-full h-full p-2 stroke-1" />
                          <span className="sr-only">No image</span>
                        </div>
                      )}
                      <div className="flex-1">
                        <p>{product.name}</p>
                        <p className="text-sm">{product.quantity} pcs.</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link href="#" className={buttonVariants()}>
                  Go to cart
                </Link>
              </>
            )}
          </div>
        </HoverCardContent>
      </HoverCard>
    </Tooltip>
  )
}
