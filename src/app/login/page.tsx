import { redirect } from "next/navigation"
import { auth } from "@/auth"

import { Footer } from "@/components/footer"
import { LoginForm } from "@/components/login-form"
import { Navbar } from "@/components/navbar"

export default async function LoginPage() {
  const googleID = await auth().then((session) => session?.user.googleID)
  if (googleID) return redirect("/main")
  return (
    <>
      <div className="absolute w-full">
        <Navbar />
      </div>
      <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
      <Footer />
    </>
  )
}
