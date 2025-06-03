import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { GoogleAnalytics } from "@next/third-parties/google"

import "./globals.css"

import { Providers } from "./provider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "lockr",
  description:
    "A zero-knowledge, end-to-end encrypted password manager that keeps your data private and secure.",
  keywords: "password manager, security, encryption, zero knowledge, privacy",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
        <GoogleAnalytics gaId="G-VCDGYQHN10" />
      </body>
    </html>
  )
}
