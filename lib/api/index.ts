import { createSafeActionClient } from "next-safe-action"
import { validateRequest } from "../auth"

export const actionClient = createSafeActionClient()
export const authActionClient = actionClient.use(async ({ next }) => {
  const { user, session } = await validateRequest()

  if (!user || !session) throw new Error("User is not authenticated")

  return next({ ctx: { user, session } })
})
