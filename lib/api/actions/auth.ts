"use server"

import { ActionError, actionClient, authActionClient } from "@/lib/api"
import { authHashConfig, lucia } from "@/lib/auth"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { userSchema } from "@/lib/validations/auth"
import { hash, verify } from "@node-rs/argon2"
import { eq } from "drizzle-orm"
import { generateIdFromEntropySize } from "lucia"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const signUp = actionClient
  .schema(userSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    const passwordHash = await hash(password, authHashConfig)
    const userId = generateIdFromEntropySize(10) // 16 characters long

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))

    if (existingUser)
      throw new ActionError("User with this email already exists")

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
    if (!existingUser) throw new ActionError("Incorrect username or password")

    const isPasswordValid = await verify(
      existingUser?.passwordHash,
      password,
      authHashConfig,
    )
    if (!isPasswordValid)
      throw new ActionError("Incorrect username or password")

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
