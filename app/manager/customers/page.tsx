import { DataTable } from "@/components/data-table"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getCustomers } from "@/lib/api/queries/users"
import { customerColumns } from "./_components/customers-table-columns"

export default async function CustomersPage() {
  const customers = await getCustomers()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customers</CardTitle>
        <CardDescription>Manage customers.</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={customerColumns} data={customers} />
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-10</strong> of <strong>0</strong> customers
        </div>
      </CardFooter>
    </Card>
  )
}
