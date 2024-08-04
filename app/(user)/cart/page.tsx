import { CartItems } from "./_components/cart-items"
import { CheckoutButton } from "./_components/checkout-button"
import { CheckoutSuccessAlert } from "./_components/checkout-success-alert"
import { ClearCartButton } from "./_components/clear-cart-button"

interface CartPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function CartPage({ searchParams }: CartPageProps) {
  return (
    <main className="container flex flex-col items-center pt-8 max-w-5xl gap-8">
      <CheckoutSuccessAlert success={searchParams.success} />
      <div className="relative w-full text-center">
        <h2 className="text-2xl font-semibold">Cart</h2>
        <ClearCartButton />
      </div>
      <CartItems />
      <CheckoutButton />
    </main>
  )
}
