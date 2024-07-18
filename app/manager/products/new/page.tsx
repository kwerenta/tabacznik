import { assertManager } from "@/lib/auth"
import { ProductForm } from "../_components/product-form"

export default async function NewProductPage() {
  await assertManager()

  return (
    <div className="mx-auto max-w-[60rem]">
      <ProductForm />
    </div>
  )
}
