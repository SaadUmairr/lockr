"use client"

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react"
import { usePathname, useRouter } from "next/navigation"
import { getCurrentUserSession, getPassphraseStatus } from "@/actions/user"
import { loadPassphrase } from "@/utils/idb.util"
import { toast } from "sonner"

interface UserContextProp {
  googleID: string
  name: string
  email: string
  avatar: string
  passphrase_ctx: string
  setPassphrase_ctx: Dispatch<SetStateAction<string>>
  isLoading: boolean
  isAuthenticated: boolean
}

const UserContext = createContext<UserContextProp | null>(null)

export function UserContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [googleID, setGoogleID] = useState<string>("")
  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [avatar, setAvatar] = useState<string>("")
  const [passphrase_ctx, setPassphrase_ctx] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Fetch user session - runs once on mount
  useEffect(() => {
    let mounted = true

    const fetchSession = async () => {
      try {
        setIsLoading(true)
        const session = await getCurrentUserSession()

        if (!mounted) return

        if (session?.user) {
          setGoogleID(session.user.googleID || "")
          setName(session.user.name || "")
          setEmail(session.user.email || "")
          setAvatar(session.user.image || "")
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
          // Only redirect if not on public pages
          if (pathname !== "/" && pathname !== "/login") {
            router.push("/login")
          }
        }
      } catch (error) {
        if (!mounted) return
        console.error("[UserContext] Session fetch error:", error)
        setIsAuthenticated(false)
        toast.error("Failed to load session")
        router.push("/login")
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    fetchSession()

    return () => {
      mounted = false
    }
  }, [router, pathname])

  // Check passphrase ONLY for protected routes (not on passphrase page itself)
  useEffect(() => {
    // Skip if:
    // - Not authenticated
    // - Already on passphrase page
    // - On public pages
    // - No googleID yet
    // - Still loading
    const isPassphrasePage = pathname === "/passphrase"
    const isPublicPage = pathname === "/" || pathname === "/login"

    if (
      !isAuthenticated ||
      !googleID ||
      isLoading ||
      isPassphrasePage ||
      isPublicPage
    ) {
      return
    }

    let mounted = true

    const checkPassphraseForProtectedRoute = async () => {
      try {
        // Try to load passphrase from IndexedDB
        const localPassphrase = await loadPassphrase()

        if (!mounted) return

        if (localPassphrase) {
          // Found local passphrase - set it in context
          setPassphrase_ctx(localPassphrase)
          return
        }

        // No local passphrase - check if user has set one on server
        const passphraseExists = await getPassphraseStatus(googleID)

        if (!mounted) return

        if (!passphraseExists) {
          // Never set up - redirect to setup
          console.log("[UserContext] No passphrase found, redirecting to setup")
          router.push("/passphrase?mode=setup")
        } else {
          // Exists on server but not local - redirect to enter
          console.log("[UserContext] Passphrase exists, redirecting to enter")
          router.push("/passphrase?mode=enter")
        }
      } catch (error) {
        if (!mounted) return
        console.error("[UserContext] Passphrase check error:", error)
        toast.error("Failed to verify passphrase")
        // On error, try setup mode
        router.push("/passphrase?mode=setup")
      }
    }

    checkPassphraseForProtectedRoute()

    return () => {
      mounted = false
    }
  }, [googleID, isAuthenticated, isLoading, router, pathname])

  return (
    <UserContext.Provider
      value={{
        googleID,
        name,
        email,
        avatar,
        passphrase_ctx,
        setPassphrase_ctx,
        isLoading,
        isAuthenticated,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = (): UserContextProp => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within a UserContextProvider")
  }
  return context
}
