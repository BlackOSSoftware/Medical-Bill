"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Activity, LayoutDashboard, Package, FileText, BarChart3, Users, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { logout, getUserRole } from "@/lib/auth"
import { useEffect, useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["admin", "staff"] },
  { name: "Products", href: "/products", icon: Package, roles: ["admin", "staff"] },
  { name: "Billing", href: "/billing", icon: FileText, roles: ["admin", "staff"] },
  { name: "Invoices", href: "/invoices", icon: FileText, roles: ["admin", "staff"] },
  { name: "Reports", href: "/reports", icon: BarChart3, roles: ["admin"] },
  { name: "Users", href: "/users", icon: Users, roles: ["admin"] },
  { name: "Settings", href: "/settings", icon: Settings, roles: ["admin"] },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadRole = () => {
      const role = getUserRole()
      console.log("[v0] Dashboard Sidebar - User Role:", role)

      if (role) {
        setUserRole(role)
        setIsLoading(false)
      } else {
        // Retry after a short delay if role is not found
        setTimeout(() => {
          const retryRole = getUserRole()
          console.log("[v0] Dashboard Sidebar - Retry User Role:", retryRole)
          setUserRole(retryRole)
          setIsLoading(false)
        }, 200)
      }
    }

    loadRole()
  }, [])

  const filteredNavigation = navigation.filter((item) => userRole && item.roles.includes(userRole))

  console.log(
    "[v0] Dashboard Sidebar - Filtered Navigation:",
    filteredNavigation.map((n) => n.name),
  )

  if (isLoading) {
    return (
      <aside className="w-64 border-r bg-card">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <Activity className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold">MediBill</span>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          <div className="text-sm text-muted-foreground">Loading...</div>
        </nav>
      </aside>
    )
  }

  return (
    <aside className="w-64 border-r bg-card">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <Activity className="h-8 w-8 text-blue-600" />
        <span className="text-xl font-bold">MediBill</span>
      </div>

      <nav className="flex flex-col gap-1 p-4">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  isActive && "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Button>
            </Link>
          )
        })}

        <Button
          variant="ghost"
          className="w-full justify-start gap-3 mt-auto text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={logout}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </nav>
    </aside>
  )
}
