"use client"

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { formatCurrency, formatCurrencyCompact } from "@/lib/formatters"
import { format } from "date-fns"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

interface RevenueChartProps {
  data: { date: string; revenue: number }[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <ChartContainer config={chartConfig}>
      <AreaChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(date) => format(new Date(date), "MMM yyyy")}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={formatCurrencyCompact}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              indicator="dot"
              labelFormatter={(label) => format(new Date(label), "MMMM yyyy")}
              formatter={(value, name) => (
                <>
                  <div className="shrink-0 rounded-[2px] border-[hsl(var(--chart-2))] bg-[hsl(var(--chart-2))] h-2.5 w-2.5" />
                  <div className="flex flex-1 gap-1 justify-between leading-none">
                    <span className="text-muted-foreground">
                      {chartConfig[name as keyof typeof chartConfig]?.label ||
                        name}
                    </span>
                    <span className="ml-auto font-mono font-medium tabular-nums text-foreground">
                      {formatCurrency(Number(value))}
                    </span>
                  </div>
                </>
              )}
            />
          }
        />
        <defs>
          <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-revenue)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-revenue)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <Area
          dataKey="revenue"
          type="natural"
          fill="url(#fillRevenue)"
          fillOpacity={0.4}
          stroke="var(--color-revenue)"
        />
      </AreaChart>
    </ChartContainer>
  )
}
