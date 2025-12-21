import { redirect } from "next/navigation"
import { auth } from "@/auth"

import { PassphraseInput } from "@/components/passphrase-input"

export default async function PassphrasePage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>
}) {
  const session = await auth()

  if (!session?.user?.googleID) {
    redirect("/login")
  }

  const mode = (await searchParams).mode
  if (!mode || (mode !== "setup" && mode !== "enter")) {
    redirect("/passphrase?mode=enter")
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <PassphraseInput
        googleID={session.user.googleID}
        userName={session.user.name || ""}
        userEmail={session.user.email || ""}
        mode={mode as "setup" | "enter"}
      />
    </div>
  )
}
