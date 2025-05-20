import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { UserContextProvider } from "@/context/user.context"

import { PassphraseInput } from "@/components/passphrase-input"

export default async function PassphrasePage() {
  const googleID = await auth().then((session) => session?.user.googleID)
  if (!googleID) return redirect("/")
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <UserContextProvider>
        <PassphraseInput />
      </UserContextProvider>
    </div>
  )
}
