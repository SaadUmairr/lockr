import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      name: string
      email: string
      image: string
      googleID: string // ✅ Add this!
    }
  }

  interface User {
    googleID: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    googleID: string
  }
}
