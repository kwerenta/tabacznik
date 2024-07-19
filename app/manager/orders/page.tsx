import { DataTable } from "@/components/data-table"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getOrderDetails, getRecentOrders } from "@/lib/api/queries/orders"
import { assertManager } from "@/lib/auth"
import { formatCurrency } from "@/lib/formatters"
import { OrderDetailsCard } from "./_components/order-details"
import { orderColumns } from "./_components/order-table-columns"

export default async function OrdersPage() {
  await assertManager()
  const recentOrders = await getRecentOrders()
  const orderDetails = await getOrderDetails(recentOrders[0]?.id ?? "")

  return (
    <div className="grid items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>This Week</CardDescription>
              <CardTitle className="text-4xl">
                {formatCurrency(132900)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                +1% from last week
              </div>
            </CardContent>
            <CardFooter>
              <Progress value={1} aria-label="1% increase" />
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>This Month</CardDescription>
              <CardTitle className="text-4xl">
                {formatCurrency(532900)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                +22% from last month
              </div>
            </CardContent>
            <CardFooter>
              <Progress value={22} aria-label="22% increase" />
            </CardFooter>
          </Card>
        </div>
        <Card>
          <CardHeader className="px-7">
            <CardTitle>Orders</CardTitle>
            <CardDescription>Recent orders from your store.</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable columns={orderColumns} data={recentOrders} />
          </CardContent>
        </Card>
      </div>
      {orderDetails && <OrderDetailsCard order={orderDetails} />}
    </div>
  )
}
