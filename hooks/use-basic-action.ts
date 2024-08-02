import { type HookSafeActionFn, useAction } from "next-safe-action/hooks"
import { toast } from "sonner"
import type { Schema } from "zod"

export const useBasicAction = <
  ServerError extends string,
  S extends Schema | undefined,
  BAS extends readonly Schema[],
  CVE,
  CBAVE,
  Data,
>(
  safeActionFn: HookSafeActionFn<ServerError, S, BAS, CVE, CBAVE, Data>,
  successMessage: string,
) => {
  return useAction<ServerError, S, BAS, CVE, CBAVE, Data>(safeActionFn, {
    onSuccess: () => {
      toast.success(successMessage)
    },
    onError: ({ error }) => {
      toast.error(error.serverError || error.fetchError)
    },
  })
}
