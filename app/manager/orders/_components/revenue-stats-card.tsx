import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface RevenueStatsCardProps {
  timeUnit: "week" | "month"
  title: string
  progressValue: number
}

export function RevenueStatsCard({
  title,
  timeUnit,
  progressValue,
}: RevenueStatsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription className="capitalize">
          This {timeUnit}
        </CardDescription>
        <CardTitle className="text-4xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">
          {progressValue > 0 ? "+" : ""}
          {progressValue}% from last {timeUnit}
        </div>
      </CardContent>
      <CardFooter>
        <Progress
          value={progressValue}
          aria-label={`${Math.abs(progressValue)}% ${progressValue >= 0 ? "increase" : "decrease"}`}
        />
      </CardFooter>
    </Card>
  )
}
