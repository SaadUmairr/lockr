"use server"

import { auth, signIn, signOut } from "@/auth"
import { UserEncryptionKey } from "@/generated/prisma/client"
import { AuthError } from "next-auth"

import { prisma } from "@/lib/db"

export interface PasswordEntryCreateInput {
  userId: string
  space?: string
  website?: string | null
  username: string
  password: string
  iv: string
}

export async function SaveUserKeysInDB({
  googleID,
  passphrase,
  aesKey,
  aesIV,
}: UserEncryptionKey) {
  try {
    // Check if keys already exist
    const existing = await prisma.userEncryptionKey.findUnique({
      where: { googleID },
    })

    if (existing) {
      // Update existing keys
      const dbResponse = await prisma.userEncryptionKey.update({
        where: { googleID },
        data: {
          passphrase,
          aesIV,
          aesKey,
        },
      })
      return dbResponse
    }

    // Create new keys
    const dbResponse = await prisma.userEncryptionKey.create({
      data: {
        googleID,
        passphrase,
        aesIV,
        aesKey,
      },
    })
    return dbResponse
  } catch (error) {
    console.error("SaveUserKeysInDB error:", error)
    throw new Error(
      `Failed to save encryption keys: ${(error as Error).message}`
    )
  }
}

export async function getUserAESKeyRecord(googleID: string) {
  if (!googleID) {
    throw new Error("Google ID is required")
  }

  try {
    const key = await prisma.userEncryptionKey.findUnique({
      where: { googleID },
    })

    return key
  } catch (error) {
    console.error("getUserAESKeyRecord error:", error)
    throw new Error(
      `Failed to fetch encryption keys: ${(error as Error).message}`
    )
  }
}

export async function getPassphraseStatus(googleID: string) {
  if (!googleID) {
    throw new Error("Google ID is required")
  }

  try {
    const user = await prisma.user.findUnique({
      where: { googleID },
      select: { isPassphraseSet: true },
    })

    return user?.isPassphraseSet ?? false
  } catch (error) {
    console.error("getPassphraseStatus error:", error)
    throw new Error(
      `Failed to get passphrase status: ${(error as Error).message}`
    )
  }
}

export async function setPassphraseStatus(googleID: string) {
  if (!googleID) {
    throw new Error("Google ID is required")
  }

  try {
    const user = await prisma.user.findUnique({ where: { googleID } })

    if (!user) {
      throw new Error("User not found")
    }

    const updatedUser = await prisma.user.update({
      where: { googleID },
      data: { isPassphraseSet: true },
    })

    return updatedUser
  } catch (error) {
    console.error("setPassphraseStatus error:", error)
    throw new Error(
      `Failed to update passphrase status: ${(error as Error).message}`
    )
  }
}

export async function getCurrentUserSession() {
  try {
    const session = await auth()
    return session
  } catch (error) {
    console.error("getCurrentUserSession error:", error)
    throw new Error(`Failed to get session: ${(error as Error).message}`)
  }
}

export async function SaveCredentials({
  userId,
  space = "main",
  website,
  username,
  password,
  iv,
}: PasswordEntryCreateInput) {
  if (!username || !password || !iv) {
    throw new Error("Username, password, and IV are required")
  }

  if (!userId) {
    throw new Error("User ID is required")
  }

  try {
    const response = await prisma.passwordEntry.create({
      data: {
        userId,
        space,
        website,
        username,
        password,
        iv,
      },
    })
    return response
  } catch (error) {
    console.error("SaveCredentials error:", error)
    throw new Error(`Failed to save credentials: ${(error as Error).message}`)
  }
}

export async function GetCredentials(googleID: string) {
  if (!googleID) {
    throw new Error("Google ID is required")
  }

  try {
    const records = await prisma.passwordEntry.findMany({
      where: { userId: googleID },
      orderBy: { createdAt: "desc" },
    })
    return records
  } catch (error) {
    console.error("GetCredentials error:", error)
    throw new Error(`Failed to get credentials: ${(error as Error).message}`)
  }
}

export async function GetSpaces(googleID: string) {
  if (!googleID) {
    throw new Error("Google ID is required")
  }

  try {
    const spaces = await prisma.passwordEntry.findMany({
      where: { userId: googleID },
      distinct: ["space"],
      select: {
        space: true,
      },
      orderBy: { space: "asc" },
    })
    return spaces
      .map((entry) => entry.space)
      .filter((space): space is string => Boolean(space))
  } catch (error) {
    console.error("GetSpaces error:", error)
    throw new Error(`Failed to get spaces: ${(error as Error).message}`)
  }
}

export async function DeleteCredential(id: string) {
  if (!id) {
    throw new Error("Credential ID is required")
  }

  try {
    const response = await prisma.passwordEntry.delete({ where: { id } })
    return response
  } catch (error) {
    console.error("DeleteCredential error:", error)
    throw new Error(`Failed to delete credential: ${(error as Error).message}`)
  }
}

export async function GoogleLoginHandler() {
  // try {
  await signIn("google")
  // } catch (error) {
  //   console.error("GoogleLoginHandler error:", error)
  //   console.log({ error });
  // 	if (error instanceof Error) {
  // 		const { type, cause } = error as AuthError;
  // 		switch (type) {
  // 			case "CredentialsSignin":
  // 				return "Invalid credentials.";
  // 			case "CallbackRouteError":
  // 				return cause?.err?.toString();
  // 			default:
  // 				return "Something went wrong.";
  // 		}
  // 	}

  //   // throw new Error(`Failed to sign in: ${(error as Error).message}`)
  // 	throw error;
  // }
}

export async function LogoutHandler() {
  try {
    return await signOut({ redirect: false })
  } catch (error) {
    console.error("LogoutHandler error:", error)
    throw new Error(`Failed to sign out: ${(error as Error).message}`)
  }
}
