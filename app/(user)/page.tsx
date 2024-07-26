import { validateRequest } from "@/lib/auth"

export default async function IndexPage() {
  const { user } = await validateRequest()

  return (
    <main className="container flex flex-col items-center">
      <h1 className="text-2xl">
        Welcome <span className="font-bold">{user?.email}</span>!
      </h1>
    </main>
  )
}
