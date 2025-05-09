import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle"
import type { Options } from "@node-rs/argon2"
import { Lucia, type Session, type User } from "lucia"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { cache } from "react"
import { db } from "./db"
import { sessions, users } from "./db/schema"

const adapter = new DrizzleSQLiteAdapter(db, sessions, users)

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      firstName: attributes.firstName,
      lastName: attributes.lastName,
      phone: attributes.phone,
      email: attributes.email,
      isManager: attributes.isManager,
    }
  },
})

export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null
    if (!sessionId) {
      return {
        user: null,
        session: null,
      }
    }

    const result = await lucia.validateSession(sessionId)
    // next.js throws when you attempt to set cookie when rendering page
    try {
      if (result.session?.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id)
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        )
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie()
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        )
      }
    } catch {}
    return result
  },
)

export async function assertUser(redirectUrl = "/login") {
  const { user } = await validateRequest()

  if (!user) return redirect(redirectUrl)
  return user
}

export async function assertManager(redirectUrl = "/") {
  const { user } = await validateRequest()

  if (!user || !user.isManager) return redirect(redirectUrl)
  return user
}

export const authHashConfig: Options = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
}

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: DatabaseUserAttributes
  }
}

interface DatabaseUserAttributes {
  firstName: string
  lastName: string
  phone: string
  email: string
  isManager: boolean
}
