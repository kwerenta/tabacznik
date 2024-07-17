import { getProductById } from "@/lib/api/queries/products"
import { notFound } from "next/navigation"
import { ProductForm } from "../../_components/product-form"

interface EditProductPageProps {
  params: {
    productId: string
  }
}

export default async function EditProductPage({
  params: { productId },
}: EditProductPageProps) {
  const [product] = await getProductById(+productId)
  if (!product) return notFound()

  return (
    <div className="mx-auto max-w-[60rem]">
      <ProductForm product={product} />
    </div>
  )
}
