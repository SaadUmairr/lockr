"use client"

import Image from "next/image"
import Link from "next/link"

import Github from "../../public/github.svg"

const Footer: React.FC = () => {
  const currentYear = new Date().getUTCFullYear()
  return (
    <footer className="border-border bg-background text-muted-foreground border-t py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="mb-4 flex items-center space-x-2 md:mb-0">
            <Image src="/key96.svg" alt="lockr" width={24} height={24} />
            <span className="text-foreground text-lg font-bold">lockr</span>
          </div>

          <div className="mb-4 flex space-x-6 md:mb-0">
            <Link
              href="/#features"
              className="hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
          </div>

          <div className="flex space-x-4">
            <Link
              href="https://github.com/saadumairr/lockr"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src={Github} alt="GitHub" height={18} width={18} />
            </Link>
          </div>
        </div>

        <hr className="border-border my-6" />

        <div className="text-center text-sm">
          <p>Zero-knowledge, open-source password manager.</p>
          <p className="mt-2">
            &copy; {currentYear} lockr. No tracking. No ads. Pure security.
          </p>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
