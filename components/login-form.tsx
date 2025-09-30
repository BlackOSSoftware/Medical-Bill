"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Activity } from "lucide-react"
import { setAuthCookie } from "@/lib/auth"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Demo credentials
    if (email === "admin@medibill.com" && password === "admin123") {
      // Set localStorage first
      localStorage.setItem("userRole", "admin")
      localStorage.setItem("userName", "Admin User")

      // Verify it was set
      const verifyRole = localStorage.getItem("userRole")
      console.log("[v0] Login - Admin user logged in, role set to:", verifyRole)

      // Set cookie
      setAuthCookie("admin", "Admin User")

      // Small delay to ensure localStorage persists
      setTimeout(() => {
        router.push("/dashboard")
      }, 100)
    } else if (email === "staff@medibill.com" && password === "staff123") {
      // Set localStorage first
      localStorage.setItem("userRole", "staff")
      localStorage.setItem("userName", "Billing Staff")

      // Verify it was set
      const verifyRole = localStorage.getItem("userRole")
      console.log("[v0] Login - Staff user logged in, role set to:", verifyRole)

      // Set cookie
      setAuthCookie("staff", "Billing Staff")

      // Small delay to ensure localStorage persists
      setTimeout(() => {
        router.push("/dashboard")
      }, 100)
    } else {
      setError("Invalid credentials. Try admin@medibill.com / admin123 or staff@medibill.com / staff123")
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="space-y-4 text-center">
        <div className="flex justify-center">
          <div className="flex items-center gap-2 text-blue-600">
            <Activity className="h-10 w-10" />
            <span className="text-2xl font-bold">MediBill</span>
          </div>
        </div>
        <div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@medibill.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>

          <Button type="button" variant="link" className="w-full text-sm text-muted-foreground">
            Forgot Password?
          </Button>

          <div className="mt-6 p-4 bg-muted rounded-lg text-sm space-y-2">
            <p className="font-semibold">Demo Credentials:</p>
            <p>Admin: admin@medibill.com / admin123</p>
            <p>Staff: staff@medibill.com / staff123</p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
