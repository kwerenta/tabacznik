import { getNewProducts, getPopularProducts } from "@/lib/api/queries/products"
import { ProductShowcase } from "./_components/product-showcase"

export default async function IndexPage() {
  const [popularProducts, newProducts] = await Promise.all([
    getPopularProducts(),
    getNewProducts(),
  ])

  return (
    <main className="container flex flex-col items-center pt-8 max-w-5xl gap-8">
      <section className="w-full">
        <h2 className="text-xl font-semibold underline mb-4">
          Most popular products
        </h2>
        <div className="flex flex-wrap gap-4">
          {popularProducts.map((product) => (
            <ProductShowcase key={product.id} product={product} />
          ))}
        </div>
      </section>
      <section className="w-full">
        <h2 className="text-xl font-semibold underline mb-4">New products</h2>
        <div className="flex flex-wrap gap-4">
          {newProducts.map((product) => (
            <ProductShowcase key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  )
}
