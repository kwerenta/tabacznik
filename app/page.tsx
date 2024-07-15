import { LogOutButton } from "@/components/logout-button"
import { validateRequest } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function IndexPage() {
  const { user } = await validateRequest()
  if (!user) redirect("/login")

  return (
    <main className="container flex flex-col items-center">
      <h1 className="text-2xl">
        Welcome <span className="font-bold">{user.email}</span>!
      </h1>
      <LogOutButton />
    </main>
  )
}
