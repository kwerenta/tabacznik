import { type FileRouter, createUploadthing } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"
import { lucia } from "./auth"

const f = createUploadthing()

export const ourFileRouter = {
  imageUploader: f({
    image: { maxFileSize: "2MB", minFileCount: 1, maxFileCount: 4 },
  })
    .middleware(async ({ req }) => {
      const sessionId = req.cookies.get(lucia.sessionCookieName)?.value ?? null
      if (!sessionId) throw new UploadThingError("Unauthorized")

      const { user } = await lucia.validateSession(sessionId)
      if (!user || !user.isManager) throw new UploadThingError("Unauthorized")

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId)

      console.log("file url", file.url)
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
