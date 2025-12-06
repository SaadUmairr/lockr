"use client"

import { useCallback, useEffect, useState, useTransition } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { IconBrandGithub } from "@tabler/icons-react"
import { Menu, X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { useIsMobile } from "@/hooks/use-mobile"

import Github from "../../public/github.svg"
import ThemeToggler from "./theme-toggle"
import { Button } from "./ui/button"

interface NavLinkProps {
  href: string
  children: React.ReactNode
  external?: boolean
  onClick?: () => void
}

const NavLink = ({
  href,
  children,
  external = false,
  onClick,
}: NavLinkProps) => {
  const handleClick = useCallback(() => {
    onClick?.()
  }, [onClick])

  return (
    <Link
      href={href}
      className="text-slate-700 transition duration-300 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-50"
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onClick={handleClick}
    >
      <motion.span
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        className="flex items-center space-x-1"
      >
        {children}
      </motion.span>
    </Link>
  )
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const isMobile = useIsMobile()
  const router = useRouter()

  useEffect(() => {
    if (!isMobile && isOpen) {
      const timeoutId = setTimeout(() => {
        setIsOpen(false)
      }, 0)

      return () => clearTimeout(timeoutId)
    }
  }, [isMobile, isOpen])

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const closeMenu = useCallback(() => {
    setIsOpen(false)
  }, [])

  const handleGoToApp = useCallback(() => {
    startTransition(() => {
      router.push("/login")
    })
  }, [router])

  return (
    <motion.nav
      className="border-b border-slate-200 bg-white py-4 text-slate-900 dark:border-slate-800 dark:bg-slate-900"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" onClick={closeMenu}>
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Image src="/key96.svg" alt="KEY" width={24} height={24} priority />
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              lockr
            </span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <div className="flex items-center space-x-8">
            <ThemeToggler />
            <NavLink href="#features">Features</NavLink>
            <NavLink href="/privacy">Privacy</NavLink>
            <NavLink href="https://github.com/saadumairr/lockr" external>
              <IconBrandGithub size={16} aria-hidden="true" />
              <span>GitHub</span>
            </NavLink>
            <Button
              className="bg-sky-500 transition-colors hover:bg-sky-600"
              onClick={handleGoToApp}
              disabled={isPending}
            >
              {isPending ? "Loading..." : "Go to App"}
            </Button>
          </div>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <motion.button
            className="rounded-md p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
            onClick={toggleMenu}
            whileTap={{ scale: 0.95 }}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? (
              <X
                className="h-6 w-6 text-slate-600 dark:text-white"
                aria-hidden="true"
              />
            ) : (
              <Menu
                className="h-6 w-6 text-slate-600 dark:text-white"
                aria-hidden="true"
              />
            )}
          </motion.button>
        )}
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            id="mobile-menu"
            className="bg-slate-100 py-2 dark:bg-slate-800"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto flex flex-col space-y-3 px-4 py-2">
              <div className="flex items-center gap-x-2">
                <ThemeToggler />
                <span className="text-slate-900 dark:text-slate-200">
                  Toggle Theme
                </span>
              </div>

              <NavLink href="#features" onClick={closeMenu}>
                Features
              </NavLink>

              <NavLink href="/privacy" onClick={closeMenu}>
                Privacy
              </NavLink>

              <NavLink
                href="https://github.com/saadumairr/lockr"
                external
                onClick={closeMenu}
              >
                <Image
                  src={Github}
                  alt="GitHub"
                  height={18}
                  width={18}
                  className="rounded-full bg-black dark:bg-transparent"
                />
                <span>GitHub</span>
              </NavLink>

              <Button
                className="mt-2 w-full bg-sky-500 transition-colors hover:bg-sky-600"
                onClick={() => {
                  closeMenu()
                  handleGoToApp()
                }}
                disabled={isPending}
              >
                {isPending ? "Loading..." : "Go to App"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export { Navbar }
