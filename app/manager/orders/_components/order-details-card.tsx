import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getOrderDetails } from "@/lib/api/queries/orders"
import type { Order } from "@/lib/db/schema"
import { formatCurrency } from "@/lib/formatters"
import { format, formatISO } from "date-fns"
import { CreditCard, Trash2 } from "lucide-react"
import { CopyOrderIdButton } from "./copy-order-id-button"
import { EmptyOrderDetailsCard } from "./empty-order-details-card"

interface OrderDetailsProps {
  orderId?: Order["id"]
}

export async function OrderDetailsCard({ orderId }: OrderDetailsProps) {
  if (!orderId) return <EmptyOrderDetailsCard />
  const order = await getOrderDetails(orderId)
  if (!order) return <EmptyOrderDetailsCard />

  const subtotal = order.products.reduce(
    (total, product) => total + product.price * product.quantity,
    0,
  )

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            Order {order.id}
            <CopyOrderIdButton orderId={order.id} />
          </CardTitle>
          <CardDescription>
            Date: {format(order.createdAt, "MMMM dd, yyyy")}
          </CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Button size="icon" variant="outline" className="h-8 w-8">
            <Trash2 className="h-3.5 w-3.5" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <div className="grid gap-3">
          <div className="font-semibold">Order Details</div>
          <ul className="grid gap-3">
            {order.products.map((product) => (
              <li
                key={product.slug}
                className="flex items-center justify-between"
              >
                <span className="text-muted-foreground">
                  {product.name} x <span>{product.quantity}</span>
                </span>
                <span>{formatCurrency(product.price * product.quantity)}</span>
              </li>
            ))}
          </ul>
          <Separator className="my-2" />
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>$0.00</span>
            </li>
            <li className="flex items-center justify-between font-semibold">
              <span className="text-muted-foreground">Total</span>
              <span>{formatCurrency(subtotal)}</span>
            </li>
          </ul>
        </div>
        <Separator className="my-4" />
        <div className="grid gap-3">
          <div className="font-semibold">Shipping Information</div>
          <address className="grid gap-3 not-italic">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Address</span>
              <span>Great Street 178/2</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">City</span>
              <span>80-000 Warsaw</span>
            </div>
          </address>
        </div>
        <Separator className="my-4" />
        <div className="grid gap-3">
          <div className="font-semibold">Customer Information</div>
          <dl className="grid gap-3">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Full Name</dt>
              <dd>
                {order.user.firstName} {order.user.lastName}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Email</dt>
              <dd>
                <a href="mailto:">{order.user.email}</a>
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Phone</dt>
              <dd>
                <a href="tel:">{order.user.phone}</a>
              </dd>
            </div>
          </dl>
        </div>
        <Separator className="my-4" />
        <div className="grid gap-3">
          <div className="font-semibold">Payment Information</div>
          <dl className="grid gap-3">
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-1 text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                Visa
              </dt>
              <dd>**** **** **** 4242</dd>
            </div>
          </dl>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
        <div className="text-xs text-muted-foreground">
          Updated{" "}
          <time
            dateTime={formatISO(order.createdAt, { representation: "date" })}
          >
            {format(order.createdAt, "MMMM dd, yyyy")}
          </time>
        </div>
      </CardFooter>
    </Card>
  )
}
