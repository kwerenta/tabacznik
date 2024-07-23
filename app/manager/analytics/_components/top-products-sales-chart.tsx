"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { formatNumber, formatPercent } from "@/lib/formatters"
import { format } from "date-fns"

interface TopProductSalesChartProps {
  data: { product: string; sales: number }[]
  date: string
  totalSales: number | undefined
}

export function TopProductSalesChart({
  data,
  date,
  totalSales,
}: TopProductSalesChartProps) {
  const salesSum = React.useMemo(
    () => data.reduce((acc, { sales }) => acc + sales, 0),
    [data],
  )

  const dataWithFill = React.useMemo(
    () =>
      data.map((entry, index) => ({
        ...entry,
        fill: `var(--color-product-${index})`,
      })),
    [data],
  )

  const productsConfig = React.useMemo(
    () =>
      Object.fromEntries(
        data.map(({ product }, index) => [
          `product-${index}`,
          { label: product, color: `hsl(var(--chart-${(index % 5) + 1}))` },
        ]),
      ),
    [data],
  )
  const chartConfig = {
    sales: {
      label: "Sales",
    },
    ...productsConfig,
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Best Selling Prodcuts</CardTitle>
        <CardDescription>{format(new Date(date), "MMMM yyyy")}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={dataWithFill}
              dataKey="sales"
              nameKey="product"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {formatNumber(salesSum)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Sold products
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col text-sm font-medium leading-none">
        These products account for{" "}
        {formatPercent(totalSales ? salesSum / totalSales : 1)} of total sales
        this month
      </CardFooter>
    </Card>
  )
}
