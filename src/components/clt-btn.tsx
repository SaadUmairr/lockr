"use client"

import { useState } from "react"
import Image from "next/image"
import { GoogleLoginHandler } from "@/actions/user"
import { UserIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

import Google from "../../public/google.svg"

export function GoogleClientButton() {
  const handleLogin = async () => {
    await GoogleLoginHandler()
  }

  return (
    <Button
      variant="outline"
      type="button"
      className="w-full border-[#1446B5] dark:border-[#1446B5]"
      onClick={handleLogin}
    >
      <Image src={Google} alt="Google" width={20} height={20} />
      Continue with Google
    </Button>
  )
}

export function GuestClientButton() {
  const [loading, setLoading] = useState(false)
  return (
    <Button
      variant="outline"
      type="button"
      className="w-full gap-x-4 border-[#1446B5] dark:border-[#1446B5]"
      onClick={() => {
        setLoading(true)
        toast.info("COMING SOON 🤌")
        setTimeout(() => setLoading(false), 2000)
      }}
      disabled={loading}
    >
      <UserIcon />
      Try as guest
    </Button>
  )
}
