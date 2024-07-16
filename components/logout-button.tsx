"use client"

import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/api/actions/auth"
import { useAction } from "next-safe-action/hooks"

export function LogOutButton() {
  const { execute } = useAction(signOut, {
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
  })

  return <Button onClick={() => execute()}>Log Out</Button>
}
