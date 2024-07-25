import * as React from "react"

interface ImageInputProps {
  disabled?: boolean
  onChange: (file: File) => void
}

export const ImageInput = React.forwardRef<HTMLInputElement, ImageInputProps>(
  ({ onChange, disabled, ...props }, ref) => (
    <input
      ref={ref}
      type="file"
      className="hidden"
      disabled={disabled}
      accept="image/png,image/jpeg,image/gif"
      onChange={async (event) => {
        const file = event.target.files?.[0]
        if (!file) return

        onChange(file)
      }}
      {...props}
    />
  ),
)
