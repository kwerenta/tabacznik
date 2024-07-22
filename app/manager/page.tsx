import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getRevenueStats, getSalesStats } from "@/lib/api/queries/orders"
import { getCustomersStats } from "@/lib/api/queries/users"
import { assertManager } from "@/lib/auth"
import { formatCurrency, formatNumberWithSign } from "@/lib/formatters"
import { CreditCard, DollarSign, Users } from "lucide-react"
import { DashboardStatsCard } from "./_components/dashboard-stats-card"

export default async function ManagerDashboardPage() {
  await assertManager()
  const revenueStats = await getRevenueStats(false)
  const salesStats = await getSalesStats()
  const customersStats = await getCustomersStats()

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
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>some graph</CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>You made 22 sales this month.</CardDescription>
          </CardHeader>
          <CardContent>List of recent sales</CardContent>
        </Card>
      </div>
    </div>
  )
}
