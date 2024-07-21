import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatCurrency, formatPercent } from "@/lib/formatters"

interface RevenueStatsCardProps {
  timeUnit: "week" | "month"
  currentRevenue?: number
  previousRevenue?: number
}

const timeUnitMap: Record<RevenueStatsCardProps["timeUnit"], number> = {
  week: 7,
  month: 28,
}

export function RevenueStatsCard({
  currentRevenue,
  timeUnit,
  previousRevenue,
}: RevenueStatsCardProps) {
  const progressValue = previousRevenue
    ? (currentRevenue ?? 0) / previousRevenue - 1
    : currentRevenue ?? 0

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription className="capitalize">
          This {timeUnit}
        </CardDescription>
        <CardTitle className="text-4xl">
          {currentRevenue ? formatCurrency(currentRevenue) : "N/A"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">
          {progressValue > 0 ? "+" : ""}
          {formatPercent(progressValue)} from last {timeUnitMap[timeUnit]} days
        </div>
      </CardContent>
      <CardFooter>
        <Progress
          value={progressValue * 100}
          aria-label={`${formatPercent(Math.abs(progressValue))} ${progressValue >= 0 ? "increase" : "decrease"}`}
        />
      </CardFooter>
    </Card>
  )
}
