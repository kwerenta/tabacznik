"use server"

import { actionClient, authActionClient } from "@/lib/api"
import { hash, verify } from "@node-rs/argon2"
import { eq } from "drizzle-orm"
import { generateIdFromEntropySize } from "lucia"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"
import { lucia } from "../auth"
import { db } from "../db"
import { users } from "../db/schema"
import { userSchema } from "../validation/auth"

export const signUp = actionClient
  .schema(userSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    })
    const userId = generateIdFromEntropySize(10) // 16 characters long

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))

    if (existingUser) {
      return {
        error: "Email already in use",
      }
    }

    await db.insert(users).values({
      id: userId,
      email: email.toLowerCase(),
      passwordHash: passwordHash,
    })

    const session = await lucia.createSession(userId, {})
    const sessionCookie = lucia.createSessionCookie(session.id)
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    )
    return redirect("/")
  })

export const signIn = actionClient
  .schema(userSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))

    // Check if passsord is valid even if user doesn't exist to prevent timing attacks
    const isPasswordValid = await verify(existingUser.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    })

    if (!existingUser || !isPasswordValid) {
      return {
        error: "Incorrect username or password",
      }
    }

    const session = await lucia.createSession(existingUser.id, {})
    const sessionCookie = lucia.createSessionCookie(session.id)
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    )
    return redirect("/")
  })

export const signOut = authActionClient.action(async ({ ctx }) => {
  await lucia.invalidateSession(ctx.session.id)

  const sessionCookie = lucia.createBlankSessionCookie()
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  )

  return redirect("/login")
})
