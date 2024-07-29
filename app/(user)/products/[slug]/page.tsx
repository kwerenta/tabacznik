import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { getProductBySlug } from "@/lib/api/queries/products"
import { formatCurrency } from "@/lib/formatters"
import { ImageOff } from "lucide-react"
import Image from "next/image"
import { notFound } from "next/navigation"
import { AddToCartInput } from "./_components/add-to-cart-input"

interface ProductPageProps {
  params: { slug: string }
}

export default async function ProductPage({
  params: { slug },
}: ProductPageProps) {
  const product = await getProductBySlug(slug)

  if (!product) return notFound()

  return (
    <main className="container flex flex-col pt-8 max-w-5xl gap-8">
      <div className="flex gap-4 flex-col sm:flex-row">
        {product.imageUrls.length > 0 ? (
          <Carousel className="flex-1">
            <CarouselContent className="w-full">
              {product.imageUrls.map((url) => (
                <CarouselItem key={url}>
                  <Image
                    src={url}
                    alt="Product image"
                    width={384}
                    height={384}
                    className="w-full aspect-square object-cover rounded-md"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-1" />
            <CarouselNext className="right-1" />
          </Carousel>
        ) : (
          <div className="flex-1 rounded-md grid place-items-center border border-dashed">
            <ImageOff className="w-full h-full p-12 stroke-1" />
            <span className="sr-only">No images</span>
          </div>
        )}
        <div className="flex flex-col gap-6 flex-1">
          <h2 className="text-3xl font-semibold tracking-tight">
            {product.name}
          </h2>
          <div>
            <div className="text-xl">{formatCurrency(product.price)}</div>
            <div className="text-xs text-muted-foreground">Tax included.</div>
          </div>
          <AddToCartInput
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              imageUrl: product.imageUrls[0] ?? null,
              price: product.price,
            }}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-medium">Description</h3>
        <p>{product.description ? product.description : "No description."}</p>
      </div>
    </main>
  )
}
