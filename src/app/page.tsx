import type { Metadata } from "next"

import { Footer } from "@/components/footer"
import { Homepage } from "@/components/homepage"
import { Navbar } from "@/components/navbar"

export const metadata: Metadata = {
  title: "lockr | Secure Password Manager",
  description:
    "A zero-knowledge, end-to-end encrypted password manager that keeps your data private and secure.",
  keywords: "password manager, security, encryption, zero knowledge, privacy",
}

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
      <Navbar />
      <Homepage />
      <Footer />
    </div>
  )
}
