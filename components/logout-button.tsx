"use client"

import { signOut } from "@/lib/api/auth"
import { Button } from "./ui/button"

export function LogOutButton() {
  return (
    <Button
      onClick={async () => {
        await signOut()
      }}
    >
      Log Out
    </Button>
  )
}
