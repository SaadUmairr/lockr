import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"

import { GoogleClientButton } from "./clt-btn"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <Link
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <Image src="/key96.svg" alt="KEY" width={96} height={96} />
              </div>
              <span className="sr-only">LOCKR</span>
            </Link>
            <h1 className="text-xl font-bold">
              Welcome to &nbsp;
              <span className="text-blue-800">lockr</span>
            </h1>
          </div>
          <div className="grid gap-4">
            <GoogleClientButton />
          </div>
        </div>
      </form>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our
        <Link href="/tos">Terms of Service</Link> and &nbsp;
        <Link href="/privacy">Privacy Policy</Link>.
      </div>
    </div>
  )
}
