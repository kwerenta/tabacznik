"use client"

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { type ChartConfig, ChartContainer } from "@/components/ui/chart"
import { formatCurrency } from "@/lib/formatters"

const chartConfig = {
  currentRevenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  otherRevenue: {
    label: "Revenue",
    color: "hsl(var(--muted))",
  },
} satisfies ChartConfig

interface AverageMonthRevenueChartProps {
  data: { year: string; revenue: number }[]
}

export default function AverageMonthRevenueChart({
  data,
}: AverageMonthRevenueChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue</CardTitle>
        <CardDescription>
          Average monthly revenue this year compared to the previous year.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {data.map((yearRevenue, index) => (
          <div key={yearRevenue.year} className="grid auto-rows-min gap-2">
            <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
              {formatCurrency(yearRevenue.revenue)}
              <span className="text-sm font-normal text-muted-foreground">
                /month
              </span>
            </div>
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[32px] w-full"
            >
              <BarChart
                accessibilityLayer
                layout="vertical"
                margin={{
                  left: 0,
                  top: 0,
                  right: 0,
                  bottom: 0,
                }}
                data={[yearRevenue]}
              >
                <Bar
                  dataKey="revenue"
                  fill={`var(--color-${index === 0 ? "current" : "other"}Revenue)`}
                  radius={4}
                  barSize={32}
                >
                  <LabelList
                    position="insideLeft"
                    dataKey="year"
                    offset={8}
                    fontSize={12}
                    fill={
                      index === 0 ? "white" : "hsl(var(--muted-foreground))"
                    }
                  />
                </Bar>
                <YAxis dataKey="year" type="category" tickCount={1} hide />
                <XAxis dataKey="revenue" type="number" hide />
              </BarChart>
            </ChartContainer>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
