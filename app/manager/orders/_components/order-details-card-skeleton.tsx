import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

export function OrderDetailsCardSkeleton() {
  return (
    <Card>
      <CardHeader className="bg-muted/50">
        <Skeleton className="w-2/5 h-10" />
      </CardHeader>
      <CardContent className="p-6 gap-3">
        <div className="grid gap-3">
          <Skeleton className="w-1/2 h-6" />
          <Skeleton className="w-4/5 h-4" />
          <Skeleton className="w-5/12 h-4" />
        </div>
        <Separator className="my-4" />
        <div className="grid gap-3">
          <Skeleton className="w-2/5 h-4" />
          <Skeleton className="w-7/12 h-4" />
          <Skeleton className="w-2/3 h-6" />
        </div>
        <Separator className="my-4" />
        <div className="grid gap-3">
          <Skeleton className="w-1/4 h-6" />
          <Skeleton className="w-9/12 h-4" />
          <Skeleton className="w-7/12 h-4" />
        </div>
        <Separator className="my-4" />
        <div className="grid gap-3">
          <Skeleton className="w-1/2 h-6" />
          <Skeleton className="w-4/5 h-4" />
          <Skeleton className="w-10/12 h-4" />
          <Skeleton className="w-5/12 h-4" />
        </div>
        <Separator className="my-4" />
        <div className="grid gap-3">
          <Skeleton className="w-2/3 h-6" />
          <Skeleton className="w-2/5 h-4" />
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 px-6 py-3">
        <Skeleton className="w-2/5 h-5" />
      </CardFooter>
    </Card>
  )
}
