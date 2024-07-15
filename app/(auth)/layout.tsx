export default function AuthLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <main className="container flex items-center flex-col">{children}</main>
  )
}
