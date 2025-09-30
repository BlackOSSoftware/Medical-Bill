import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IndianRupee, Package, AlertTriangle, Clock } from "lucide-react"
import Link from "next/link"

const stats = [
  {
    title: "Today's Sales",
    value: "₹45,231",
    icon: IndianRupee,
    description: "+12% from yesterday",
    trend: "up",
  },
  {
    title: "Current Stock",
    value: "2,847",
    icon: Package,
    description: "Items in inventory",
    trend: "neutral",
  },
  {
    title: "Out of Stock",
    value: "23",
    icon: AlertTriangle,
    description: "Requires attention",
    trend: "down",
    link: "/products?filter=out-of-stock",
  },
  {
    title: "Near Expiry",
    value: "47",
    icon: Clock,
    description: "Expiring in 30 days",
    trend: "down",
    link: "/products?filter=near-expiry",
  },
]

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        const content = (
          <Card key={stat.title} className={stat.link ? "cursor-pointer hover:bg-accent transition-colors" : ""}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        )

        return stat.link ? (
          <Link key={stat.title} href={stat.link}>
            {content}
          </Link>
        ) : (
          content
        )
      })}
    </div>
  )
}
