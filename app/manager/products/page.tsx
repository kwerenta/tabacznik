import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getAllProducts } from "@/lib/api/queries/products"
import { ProductsTable } from "./_components/products-table"

export default async function ProductsPage() {
  const products = await getAllProducts()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Products</CardTitle>
        <CardDescription>
          Manage products and view their sales performance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProductsTable products={products} />
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-10</strong> of <strong>0</strong> products
        </div>
      </CardFooter>
    </Card>
  )
}
