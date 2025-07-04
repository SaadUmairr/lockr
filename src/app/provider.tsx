"use client"

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
