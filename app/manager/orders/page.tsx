import { DataTable } from "@/components/data-table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getOrderDetails, getRecentOrders } from "@/lib/api/queries/orders"
import { assertManager } from "@/lib/auth"
import { formatCurrency } from "@/lib/formatters"
import { OrderDetailsCard } from "./_components/order-details"
import { orderColumns } from "./_components/order-table-columns"
import { RevenueStatsCard } from "./_components/revenue-stats-card"

export default async function OrdersPage() {
  await assertManager()
  const recentOrders = await getRecentOrders()
  const orderDetails = await getOrderDetails(recentOrders[0]?.id ?? "")

  return (
    <div className="grid items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2">
          <RevenueStatsCard
            timeUnit="week"
            title={formatCurrency(132900)}
            progressValue={1}
          />
          <RevenueStatsCard
            timeUnit="month"
            title={formatCurrency(532900)}
            progressValue={22}
          />
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
