import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api).*)",
  ],
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const sessionToken =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value

  const isAuthenticated = !!sessionToken

  const publicRoutes = ["/", "/login", "/privacy", "/tos"]
  const isPublicRoute = publicRoutes.includes(pathname)

  const authRoutes = ["/login"]
  const isAuthRoute = authRoutes.includes(pathname)

  const isPassphraseRoute = pathname === "/passphrase"

  const protectedRoutes = ["/main", "/settings"]
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  if (!isAuthenticated && (isProtectedRoute || isPassphraseRoute)) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/main", request.url))
  }

  return NextResponse.next()
}
