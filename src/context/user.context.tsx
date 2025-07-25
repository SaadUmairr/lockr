"use client"

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react"
import { redirect } from "next/navigation"
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
}

const UserContext = createContext<UserContextProp | null>(null)

export function UserContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [googleID, setGoogleID] = useState<string>("")
  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [avatar, setAvatar] = useState<string>("")
  const [passphrase_ctx, setPassphrase_ctx] = useState<string>("")

  useEffect(() => {
    ;(async () => {
      try {
        const session = await getCurrentUserSession()
        if (session?.user) {
          setGoogleID(session.user.googleID || "")
          setName(session.user.name || "")
          setEmail(session.user.email || "")
          setAvatar(session.user.image || "")
        }
      } catch (error) {
        toast.error(`SESSION NOT FETCHED: ${(error as Error).message}`)
      }
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      const passLocal = await loadPassphrase()
      if (passLocal) {
        setPassphrase_ctx(passLocal)
        return
      }
      try {
        const passExists = await getPassphraseStatus(googleID)
        if (!passExists) redirect("/passphrase?mode=setup")
        else {
          const retryStored = await loadPassphrase()
          if (retryStored) {
            setPassphrase_ctx(retryStored)
          } else {
            redirect("/passphrase?mode=enter")
          }
        }
      } catch {
        toast.error("Passphrase Check Failed")
      }
    })()
  }, [googleID])

  return (
    <UserContext.Provider
      value={{
        googleID,
        name,
        email,
        avatar,
        passphrase_ctx,
        setPassphrase_ctx,
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
