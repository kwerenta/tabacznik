import { LogOutButton } from "@/components/logout-button"
import { assertUser } from "@/lib/auth"

export default async function IndexPage() {
  const user = await assertUser()

  return (
    <main className="container flex flex-col items-center">
      <h1 className="text-2xl">
        Welcome <span className="font-bold">{user.email}</span>!
      </h1>
      <LogOutButton />
    </main>
  )
}
