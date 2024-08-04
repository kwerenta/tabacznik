import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface CheckoutSuccessAlertProps {
  success: string | string[] | undefined
}

export function CheckoutSuccessAlert({ success }: CheckoutSuccessAlertProps) {
  if (success === undefined) return null

  return (
    <Alert variant={success === "1" ? "default" : "destructive"}>
      <AlertTitle>
        {success === "1" ? "Checkout successful" : "Checkout cancelled"}
      </AlertTitle>
      <AlertDescription>
        {success === "1"
          ? "Thank you for your purchase! Your order is being processed."
          : "You cancelled the checkout process."}
      </AlertDescription>
    </Alert>
  )
}
