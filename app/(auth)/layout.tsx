export default function AuthLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <main className="container grid place-items-center min-h-screen">
      {children}
    </main>
  )
}
