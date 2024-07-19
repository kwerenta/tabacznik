import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function EmptyOrderDetailsCard() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <CardTitle className="group flex items-center gap-2 text-lg">
          Order Not Found
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <div className="font-semibold">Select order to view its details</div>
      </CardContent>
      <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
        <div className="text-xs text-muted-foreground">
          Selected order does not exist
        </div>
      </CardFooter>
    </Card>
  )
}
