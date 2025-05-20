"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Menu, X } from "lucide-react"
import { motion } from "motion/react"

import { useIsMobile } from "@/hooks/use-mobile"

import Github from "../../public/github.svg"
import ThemeToggler from "./theme-toggle"
import { Button } from "./ui/button"

type NavLinkProps = {
  href: string
  children: React.ReactNode
  external?: boolean
}

const NavLink: React.FC<NavLinkProps> = ({
  href,
  children,
  external = false,
}) => {
  return (
    <Link
      href={href}
      className="text-slate-700 transition duration-300 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-50"
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
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

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const isMobile = useIsMobile()

  // Close mobile menu on resize to desktop
  useEffect(() => {
    if (!isMobile && isOpen) {
      setIsOpen(false)
    }
  }, [isMobile, isOpen])

  return (
    <motion.nav
      className="border-b border-slate-200 bg-white py-4 text-slate-900 dark:border-slate-800 dark:bg-slate-900"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link href="/">
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Image src="/key96.svg" alt="KEY" width={24} height={24} />
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
              <Image
                src={Github}
                alt="Github"
                height={18}
                width={18}
                className="rounded-full bg-black dark:bg-transparent"
              />
              <span>GitHub</span>
            </NavLink>
            <Button className="bg-sky-500" onClick={() => redirect("/login")}>
              Go to App
            </Button>
          </div>
        )}

        {/* Mobile menu button */}
        {isMobile && (
          <motion.button
            className="focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.95 }}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? (
              <X className="h-6 w-6 text-slate-600 dark:text-white" />
            ) : (
              <Menu className="h-6 w-6 text-slate-600 dark:text-white" />
            )}
          </motion.button>
        )}
      </div>

      {/* Mobile Navigation */}
      {isMobile && isOpen && (
        <motion.div
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
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#privacy">Privacy</NavLink>
            <NavLink href="https://github.com/saadumairr/lockr" external>
              <Image
                src={Github}
                alt="Github"
                height={18}
                width={18}
                className="rounded-full bg-black dark:bg-transparent"
              />
              <span>GitHub</span>
            </NavLink>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}

export { Navbar }
