import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn, signUp, singOut } from "@/lib/api/auth"
import { validateRequest } from "@/lib/auth"

export default async function IndexPage() {
  const { user } = await validateRequest()

  return (
    <main className="container flex justify-center">
      {user === null ? (
        <div className="flex items-center gap-8">
          <div>
            <h1 className="text-2xl font-bold">Create an account</h1>
            <form action={signUp}>
              <Label htmlFor="email">Email</Label>
              <Input name="email" id="email" />
              <br />
              <Label htmlFor="password">Password</Label>
              <Input type="password" name="password" id="password" />
              <br />
              <Button type="submit">Sign up</Button>
            </form>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Sign in</h1>
            <form action={signIn}>
              <Label htmlFor="email">Email</Label>
              <Input name="email" id="email" />
              <br />
              <Label htmlFor="password">Password</Label>
              <Input type="password" name="password" id="password" />
              <br />
              <Button type="submit">Sign in</Button>
            </form>
          </div>
        </div>
      ) : (
        <form action={singOut} className="text-center">
          <h1 className="text-2xl">
            Welcome <span className="font-bold">{user.email}</span>!
          </h1>
          <Button type="submit">Sign out</Button>
        </form>
      )}
    </main>
  )
}
