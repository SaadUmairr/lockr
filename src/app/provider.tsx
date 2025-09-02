"use client"

import { ReactLenis } from "lenis/react"
import { ThemeProvider } from "next-themes"
import NextTopLoader from "nextjs-toploader"

import { Toaster } from "@/components/ui/sonner"

export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Toaster position="bottom-center" />
      <NextTopLoader showSpinner={false} />
      <ReactLenis root />
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </>
  )
}
