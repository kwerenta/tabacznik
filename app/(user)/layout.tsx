import { SiteHeader } from "@/components/site-header"

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  )
}
