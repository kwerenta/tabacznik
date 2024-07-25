import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Trash2 } from "lucide-react"
import Image from "next/image"

interface ImagePreviewProps {
  url: string
  index: number
  onRemove: (url: string) => void
}

export function ImagePreview({ url, index, onRemove }: ImagePreviewProps) {
  return (
    <div
      className={cn("w-full relative group", index === 0 && "col-span-full")}
    >
      <Button
        type="button"
        variant="destructive"
        size="icon"
        className="absolute top-2 right-2 hidden group-hover:inline-flex"
        onClick={() => onRemove(url)}
      >
        <Trash2 className="w-3.5 h-3.5" />
      </Button>
      <Image
        alt="Product image"
        className="aspect-square w-full rounded-md object-cover"
        src={url}
        height={index === 0 ? "300" : "84"}
        width={index === 0 ? "300" : "84"}
      />
    </div>
  )
}
