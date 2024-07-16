"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { signOut } from "@/lib/api/auth"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

export function LogoutDropdownItem() {
  const { execute } = useAction(signOut, {
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
  })

  return <DropdownMenuItem onClick={() => execute()}>Logout</DropdownMenuItem>
}
