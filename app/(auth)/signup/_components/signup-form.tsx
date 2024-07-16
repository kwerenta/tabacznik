"use client"

import { LoadingButton } from "@/components/loading-button"
import { buttonVariants } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signUp } from "@/lib/api/actions/auth"
import { type UserSchema, userSchema } from "@/lib/validation/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function SignUpForm() {
  const { execute, isExecuting } = useAction(signUp, {
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
  })

  const form = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  return (
    <>
      <h1 className="text-2xl font-bold">Sign up</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(execute)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <LoadingButton isLoading={isExecuting} type="submit">
            Sign up
          </LoadingButton>
        </form>
        <p>
          Already have an account?{" "}
          <Link className={buttonVariants({ variant: "link" })} href="/login">
            Log in
          </Link>
        </p>
      </Form>
    </>
  )
}
