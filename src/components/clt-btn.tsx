"use client"

import Image from "next/image"
import { GoogleLoginHandler } from "@/actions/user"

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
