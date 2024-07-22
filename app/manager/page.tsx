import { DataTable } from "@/components/data-table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  getLastYearRevenueByMonth,
  getRecentSales,
  getRevenueStats,
  getSalesStats,
} from "@/lib/api/queries/orders"
import { getCustomersStats } from "@/lib/api/queries/users"
import { assertManager } from "@/lib/auth"
import { formatCurrency, formatNumberWithSign } from "@/lib/formatters"
import { CreditCard, DollarSign, Users } from "lucide-react"
import { DashboardStatsCard } from "./_components/dashboard-stats-card"
import { recentSaleColumns } from "./_components/recent-sales-table-columns"
import { RevenueChart } from "./_components/revenue-chart"

export default async function ManagerDashboardPage() {
  await assertManager()
  const [
    revenueStats,
    salesStats,
    customersStats,
    recentSales,
    revenueByMonth,
  ] = await Promise.all([
    getRevenueStats(false),
    getSalesStats(),
    getCustomersStats(),
    getRecentSales(),
    getLastYearRevenueByMonth(),
  ])

  return (
    <div className="space-y-4">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <DashboardStatsCard
          className="md:col-span-2 lg:col-span-1"
          title="Total Revenue"
          Icon={DollarSign}
          stats={revenueStats}
          formatter={formatCurrency}
        />
        <DashboardStatsCard
          title="Sales"
          Icon={CreditCard}
          stats={salesStats}
          formatter={formatNumberWithSign}
        />

        <DashboardStatsCard
          title="Customers"
          Icon={Users}
          stats={customersStats}
          formatter={formatNumberWithSign}
        />
      </div>
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-0">
            <RevenueChart data={revenueByMonth} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>
              You made {salesStats?.last28Days} sales this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable columns={recentSaleColumns} data={recentSales} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
