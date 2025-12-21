"use client"

import { useCallback, useTransition } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

import Github from "../../public/github.svg"
import ThemeToggler from "./theme-toggle"

const Navbar = () => {
  const [isPending, startTransition] = useTransition()
  const isMobile = useIsMobile()
  const router = useRouter()

  const handleGoToApp = useCallback(() => {
    startTransition(() => {
      router.push("/login")
    })
  }, [router])

  if (isMobile) {
    return (
      <nav className="border-border bg-background border-b">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/">
            <div className="flex items-center space-x-2">
              <Image
                className="dark:invert"
                src="/key96.svg"
                alt="lockr"
                width={24}
                height={24}
                priority
              />
              <span className="text-foreground text-xl font-bold">lockr</span>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            <ThemeToggler />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-75 sm:w-100">
                <div className="mt-8 flex flex-col space-y-4">
                  <div className="flex items-center gap-x-2">
                    <ThemeToggler />
                    <span>Toggle Theme</span>
                  </div>
                  <Link href="/#features" className="text-foreground text-lg">
                    <Button variant="link">Features</Button>
                  </Link>
                  <Link
                    href="/privacy"
                    className="hover:text-foreground text-lg"
                  >
                    <Button variant="link">Privacy</Button>
                  </Link>
                  <Link
                    href="https://github.com/saadumairr/lockr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground flex items-center space-x-2 text-lg"
                  >
                    <Image src={Github} alt="GitHub" height={18} width={18} />
                    <span>GitHub</span>
                  </Link>
                  <Button
                    onClick={handleGoToApp}
                    disabled={isPending}
                    className="w-full"
                  >
                    {isPending ? "Loading..." : "Go to App"}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="border-border bg-background border-b">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/">
          <div className="flex items-center space-x-2">
            <Image
              src="/key96.svg"
              alt="lockr"
              width={24}
              height={24}
              priority
            />
            <span className="text-foreground text-xl font-bold">lockr</span>
          </div>
        </Link>

        <div className="flex items-center space-x-8">
          <ThemeToggler />
          <Link href="/#features" className="text-foreground text-lg">
            Features
          </Link>
          <Link href="/privacy" className="text-foreground text-lg">
            Privacy
          </Link>
          <Link
            href="https://github.com/saadumairr/lockr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground flex items-center space-x-1 text-lg"
          >
            <span>GitHub</span>
          </Link>
          <Button
            onClick={handleGoToApp}
            disabled={isPending}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isPending ? "Loading..." : "Go to App"}
          </Button>
        </div>
      </div>
    </nav>
  )
}

export { Navbar }
