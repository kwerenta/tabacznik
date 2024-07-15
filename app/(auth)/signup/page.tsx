import { validateRequest } from "@/lib/auth"
import { redirect } from "next/navigation"
import { SignUpForm } from "./_components/signup-form"

export default async function SignUpPage() {
  const { user } = await validateRequest()
  if (user) redirect("/")

  return <SignUpForm />
}
