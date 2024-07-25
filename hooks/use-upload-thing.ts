import type { OurFileRouter } from "@/lib/uploadthing"
import { generateReactHelpers } from "@uploadthing/react"

export const { useUploadThing } = generateReactHelpers<OurFileRouter>()
