"use client"

import { Bar, BarChart, Label, Rectangle, ReferenceLine, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components//ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components//ui/chart"
import { formatNumber } from "@/lib/formatters"
import * as React from "react"

const chartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

interface WeekSalesChartProps {
  data: { date: string; sales: number }[]
}

export default function WeekSalesChart({ data }: WeekSalesChartProps) {
  const sum = React.useMemo(
    () => data.reduce((acc, { sales }) => acc + sales, 0),
    [data],
  )
  const average = Math.floor(sum / data.length)

  return (
    <Card>
      <CardHeader className="space-y-0 pb-2">
        <CardDescription>Today</CardDescription>
        <CardTitle className="text-4xl tabular-nums">
          {formatNumber(data.at(-1)?.sales || 0)}{" "}
          <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
            sales
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            margin={{
              left: -4,
              right: -4,
            }}
            data={data}
          >
            <Bar
              dataKey="sales"
              fill="var(--color-sales)"
              radius={5}
              fillOpacity={0.6}
              activeBar={<Rectangle fillOpacity={0.8} />}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              tickFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  weekday: "short",
                })
              }}
            />
            <ChartTooltip
              defaultIndex={2}
              content={
                <ChartTooltipContent
                  hideIndicator
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  }}
                />
              }
              cursor={false}
            />
            <ReferenceLine
              y={average}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="3 3"
              strokeWidth={1}
            >
              <Label
                position="insideBottomLeft"
                value="Average Sales"
                offset={10}
                fill="hsl(var(--foreground))"
              />
              <Label
                position="insideTopLeft"
                value={formatNumber(average)}
                className="text-lg"
                fill="hsl(var(--foreground))"
                offset={10}
                startOffset={100}
              />
            </ReferenceLine>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <CardDescription>
          Over the past 7 days,{" "}
          <span className="font-medium text-foreground">
            {formatNumber(sum)}
          </span>{" "}
          sales have been made.
        </CardDescription>
      </CardFooter>
    </Card>
  )
}
