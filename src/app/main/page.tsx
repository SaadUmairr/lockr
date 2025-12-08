import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { DataContextProvider } from "@/context/data-context"
import { KeyContextProvider } from "@/context/key-context"
import { UserContextProvider } from "@/context/user-context"

import { CredInput } from "@/components/input"
import { Main } from "@/components/main"
import { Navbar } from "@/components/secure/navbar"

export default async function MainPage() {
  const googleID = await auth().then((session) => session?.user.googleID)
  if (!googleID) return redirect("/")

  return (
    <div className="min-h-screen p-4">
      <UserContextProvider>
        <KeyContextProvider>
          <DataContextProvider>
            <Navbar />
            <main className="container mx-auto px-4 py-4">
              <Main />
            </main>
            <CredInput />
          </DataContextProvider>
        </KeyContextProvider>
      </UserContextProvider>
    </div>
  )
}
