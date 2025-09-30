export function getUserRole(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("userRole")
}

export function getUserName(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("userName")
}

export function hasPermission(requiredRole: "admin" | "staff"): boolean {
  if (typeof window === "undefined") return false
  const userRole = getUserRole()

  if (requiredRole === "admin") {
    return userRole === "admin"
  }

  // Staff and admin both have staff permissions
  return userRole === "admin" || userRole === "staff"
}

export function canAccessRoute(route: string): boolean {
  const userRole = getUserRole()

  // Admin can access everything
  if (userRole === "admin") return true

  // Staff cannot access these routes
  const adminOnlyRoutes = ["/users", "/settings", "/reports"]
  const isAdminRoute = adminOnlyRoutes.some((r) => route.startsWith(r))

  return !isAdminRoute
}

export function setAuthCookie(role: string, name: string) {
  // Set cookie for middleware to read
  document.cookie = `userRole=${role}; path=/; max-age=86400` // 24 hours
  document.cookie = `userName=${name}; path=/; max-age=86400`
}

export function logout() {
  if (typeof window === "undefined") return
  localStorage.removeItem("userRole")
  localStorage.removeItem("userName")
  document.cookie = "userRole=; path=/; max-age=0"
  document.cookie = "userName=; path=/; max-age=0"
  window.location.href = "/login"
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return !!localStorage.getItem("userRole")
}
