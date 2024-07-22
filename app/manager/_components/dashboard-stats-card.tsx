import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPercent } from "@/lib/formatters"
import { calculateProgress } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface DashboardStatsCard {
  title: string
  Icon: LucideIcon
  stats: Record<"last28Days" | "previous28Days", number> | undefined
  formatter: (value: number) => string
  className?: string
}

export function DashboardStatsCard({
  title,
  Icon,
  stats,
  formatter,
  className,
}: DashboardStatsCard) {
  const progressValue = calculateProgress(
    stats?.last28Days,
    stats?.previous28Days,
  )
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {stats ? formatter(stats.last28Days) : "N/A"}
        </div>
        <p className="text-xs text-muted-foreground">
          {formatPercent(progressValue)} from last 28 days
        </p>
      </CardContent>
    </Card>
  )
}
