import {
  getAverageMonthRevenue,
  getBestSellingProducts,
  getMonthTotalSales,
  getWeekSalesCount,
} from "@/lib/api/queries/orders"
import { assertManager } from "@/lib/auth"
import { format } from "date-fns"
import AverageMonthRevenueChart from "./_components/average-month-revenue-chart"
import { TopProductSalesChart } from "./_components/top-products-sales-chart"
import WeekSalesChart from "./_components/week-sales-chart"

export default async function AnalyticsPage() {
  await assertManager()
  const [
    averageMonthRevenue,
    weekSalesCount,
    bestSellingProducts,
    monthTotalSales,
  ] = await Promise.all([
    getAverageMonthRevenue(),
    getWeekSalesCount(),
    getBestSellingProducts(),
    getMonthTotalSales(),
  ])

  return (
    <div className="mx-auto max-w-5xl flex flex-col items-start justify-center px-6 sm:px-8 gap-6">
      <div className="grid md:grid-cols-2 w-full gap-6">
        <AverageMonthRevenueChart data={averageMonthRevenue} />
        <TopProductSalesChart
          date={format(new Date(), "yyyy-MM")}
          totalSales={monthTotalSales}
          data={bestSellingProducts}
        />
      </div>
      <div className="w-full">
        <WeekSalesChart data={weekSalesCount} />
      </div>
    </div>
  )
}
