import {
  DEFAULT_SERVER_ERROR_MESSAGE,
  createSafeActionClient,
} from "next-safe-action"
import { validateRequest } from "../auth"

export class ActionError extends Error {}

export const actionClient = createSafeActionClient({
  handleReturnedServerError: (error) => {
    if (error instanceof ActionError) return error.message

    return DEFAULT_SERVER_ERROR_MESSAGE
  },
})

export const authActionClient = actionClient.use(async ({ next }) => {
  const { user, session } = await validateRequest()

  if (!user || !session)
    throw new ActionError("You need to be logged in to perform this action")

  return next({ ctx: { user, session } })
})
