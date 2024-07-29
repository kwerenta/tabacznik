import { SiteHeader } from "@/components/site-header"
import { CartStoreProvider } from "@/providers/cart-store-provider"

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <CartStoreProvider>
      <SiteHeader />
      {children}
    </CartStoreProvider>
  )
}
