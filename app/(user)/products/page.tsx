import { getProducts } from "@/lib/api/queries/products"
import { ProductShowcase } from "../_components/product-showcase"

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <main className="container flex flex-wrap pt-8 max-w-5xl gap-8">
      {products.map((product) => (
        <ProductShowcase key={product.id} product={product} />
      ))}
    </main>
  )
}
