"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"

import Github from "../../public/github.svg"

type NavLinkProps = {
  href: string
  children: React.ReactNode
  external?: boolean
}

const FooterLink: React.FC<NavLinkProps> = ({
  href,
  children,
  external = false,
}) => {
  return (
    <Link
      href={href}
      className="text-slate-600 transition duration-300 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
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

const Footer: React.FC = () => {
  const currentYear = new Date().getUTCFullYear()
  return (
    <footer className="border-t border-slate-200 bg-slate-100 py-8 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <motion.div
            className="mb-4 flex items-center space-x-2 md:mb-0"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Image src="/key96.svg" alt="KEY" width={24} height={24} />
            <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
              lockr
            </span>
          </motion.div>

          <div className="mb-4 flex space-x-6 md:mb-0">
            <FooterLink href="/#features">Features</FooterLink>
            <FooterLink href="/privacy">Privacy</FooterLink>
            <FooterLink href="/tos">Terms of Service</FooterLink>
          </div>

          <div className="flex space-x-4">
            <FooterLink href="https://github.com/saadumairr/lockr" external>
              <Image src={Github} alt="Github" height={18} width={18} />
            </FooterLink>
          </div>
        </div>

        <hr className="my-6 border-slate-200 dark:border-slate-800" />

        <div className="text-center text-slate-600 dark:text-slate-400">
          <p>A zero-knowledge, open-source project.</p>
          <p className="mt-2">
            &copy; {currentYear} lockr - No tracking, no ads, just secure
            password storage.
          </p>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
