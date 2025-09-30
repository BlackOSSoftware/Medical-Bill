import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login"]

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Check authentication via cookie (we'll set this on login)
  const userRole = request.cookies.get("userRole")?.value

  console.log("[v0] Middleware - Path:", pathname, "Role:", userRole)

  // If not authenticated, redirect to login
  if (!userRole) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Admin-only routes
  const adminOnlyRoutes = ["/users", "/settings", "/reports"]
  const isAdminRoute = adminOnlyRoutes.some((route) => pathname.startsWith(route))

  console.log("[v0] Middleware - Is Admin Route:", isAdminRoute, "User Role:", userRole)

  // If staff tries to access admin route, redirect to dashboard
  if (isAdminRoute && userRole === "staff") {
    console.log("[v0] Middleware - Blocking staff from admin route, redirecting to dashboard")
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  console.log("[v0] Middleware - Access granted to:", pathname)

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
