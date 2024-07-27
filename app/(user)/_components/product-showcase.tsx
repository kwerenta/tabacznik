import type { Product } from "@/lib/db/schema"
import { formatCurrency } from "@/lib/formatters"
import { ImageOff } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ProductShowcaseProps {
  product: Product & { imageUrl: string | null }
}

export function ProductShowcase({ product }: ProductShowcaseProps) {
  return (
    <Link
      key={product.id}
      href={`/products/${product.slug}`}
      className="flex flex-col hover:scale-110 transition-transform group"
    >
      {product.imageUrl ? (
        <Image
          src={product.imageUrl}
          alt="Product image"
          width={192}
          height={192}
          className="aspect-square object-cover rounded-md"
        />
      ) : (
        <div className="size-48 rounded-md grid place-items-center border border-dashed">
          <ImageOff className="w-full h-full p-12" />
        </div>
      )}
      <h3 className="text-lg font-medium group-hover:underline">
        {product.name}
      </h3>
      <p>{formatCurrency(product.price)}</p>
    </Link>
  )
}
