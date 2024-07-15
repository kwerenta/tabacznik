"use server"

import { hash, verify } from "@node-rs/argon2"
import { generateIdFromEntropySize } from "lucia"
import { db } from "../db"
import { users } from "../db/schema"
import { lucia, validateRequest } from "../auth"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

export async function signUp(formData: FormData) {
  const email = formData.get("email")
  if (typeof email !== "string" || email.length < 3 || email.length > 255) {
    return {
      error: "Invalid email",
    }
  }

  const password = formData.get("password")
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return {
      error: "Invalid password",
    }
  }

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
}

export async function signIn(formData: FormData) {
  const email = formData.get("email")
  if (typeof email !== "string" || email.length < 3 || email.length > 255) {
    return {
      error: "Invalid email",
    }
  }

  const password = formData.get("password")
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return {
      error: "Invalid password",
    }
  }

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
}

export async function singOut() {
  const { session } = await validateRequest()
  if (!session) {
    return {
      error: "Unauthorized",
    }
  }

  await lucia.invalidateSession(session.id)

  const sessionCookie = lucia.createBlankSessionCookie()
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  )

  // TODO: Add login page
  return redirect("/")
}
