import { ReloadIcon } from "@radix-ui/react-icons"

import { Button, type ButtonProps } from "@/components/ui/button"

interface LoadingButtonProps extends ButtonProps {
  isLoading: boolean
  loadingText?: string
}

export function LoadingButton({
  children,
  isLoading,
  loadingText,
  ...props
}: LoadingButtonProps) {
  return (
    <Button {...props} disabled={isLoading}>
      {isLoading ? (
        <>
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          {loadingText ?? "Please wait..."}
        </>
      ) : (
        children
      )}
    </Button>
  )
}
