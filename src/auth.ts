import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

import { prisma } from "./lib/db"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET_ID!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      const { email, name, image } = user
      const googleID = account?.providerAccountId

      if (!googleID) return false

      const existingUser = await prisma.user.findUnique({
        where: { googleID },
      })

      if (!existingUser) {
        await prisma.user.create({
          data: {
            googleID,
            avatar: image ?? "",
            username: name ?? "",
            email: email ?? "",
          },
        })
      }

      return true
    },

    async jwt({ token, account }) {
      // setting googleID during sign-in
      if (account) {
        token.googleID = account.providerAccountId
      }
      return token
    },

    async session({ session, token }) {
      // Attaching googleID to session user
      if (session.user && token.googleID) {
        session.user.googleID = token.googleID as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
})
