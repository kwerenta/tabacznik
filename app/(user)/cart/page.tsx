import { CartItems } from "./_components/cart-items"
import { CheckoutButton } from "./_components/checkout-button"
import { ClearCartButton } from "./_components/clear-cart-button"

export default function CartPage() {
  return (
    <main className="container flex flex-col items-center pt-8 max-w-5xl gap-8">
      <div className="relative w-full text-center">
        <h2 className="text-2xl font-semibold">Cart</h2>
        <ClearCartButton />
      </div>
      <CartItems />
      <CheckoutButton />
    </main>
  )
}
