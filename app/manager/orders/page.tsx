import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getRecentOrders, getRevenueStats } from "@/lib/api/queries/orders"
import { assertManager } from "@/lib/auth"
import { Suspense } from "react"
import { OrderDetailsCard } from "./_components/order-details-card"
import { OrderDetailsCardSkeleton } from "./_components/order-details-card-skeleton"
import { OrderTable } from "./_components/order-table"
import { RevenueStatsCard } from "./_components/revenue-stats-card"

interface OrdersPageProps {
  searchParams: {
    order?: string
  }
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  await assertManager()
  const recentOrders = await getRecentOrders()
  const revenue = await getRevenueStats()

  return (
    <div className="grid items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2">
          <RevenueStatsCard
            timeUnit="week"
            currentRevenue={revenue?.last7Days}
            previousRevenue={revenue?.previous7Days}
          />
          <RevenueStatsCard
            timeUnit="month"
            currentRevenue={revenue?.last28Days}
            previousRevenue={revenue?.previous28Days}
          />
        </div>
        <Card>
          <CardHeader className="px-7">
            <CardTitle>Orders</CardTitle>
            <CardDescription>Recent orders from your store.</CardDescription>
          </CardHeader>
          <CardContent>
            <OrderTable data={recentOrders} />
          </CardContent>
        </Card>
      </div>
      <Suspense
        key={searchParams.order || recentOrders[0]?.id}
        fallback={<OrderDetailsCardSkeleton />}
      >
        <OrderDetailsCard orderId={searchParams.order || recentOrders[0]?.id} />
      </Suspense>
    </div>
  )
}
