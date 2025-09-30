"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const monthlyData = [
  { month: "Jan", revenue: 145000, expenses: 95000, profit: 50000 },
  { month: "Feb", revenue: 152000, expenses: 98000, profit: 54000 },
  { month: "Mar", revenue: 148000, expenses: 96000, profit: 52000 },
  { month: "Apr", revenue: 161000, expenses: 102000, profit: 59000 },
  { month: "May", revenue: 155000, expenses: 99000, profit: 56000 },
  { month: "Jun", revenue: 167000, expenses: 105000, profit: 62000 },
  { month: "Jul", revenue: 172000, expenses: 108000, profit: 64000 },
  { month: "Aug", revenue: 165000, expenses: 103000, profit: 62000 },
  { month: "Sep", revenue: 178000, expenses: 110000, profit: 68000 },
  { month: "Oct", revenue: 185000, expenses: 115000, profit: 70000 },
  { month: "Nov", revenue: 192000, expenses: 118000, profit: 74000 },
  { month: "Dec", revenue: 205000, expenses: 125000, profit: 80000 },
]

export function RevenueReport() {
  const totalRevenue = monthlyData.reduce((sum, item) => sum + item.revenue, 0)
  const totalProfit = monthlyData.reduce((sum, item) => sum + item.profit, 0)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">For the year 2024</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalProfit.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Net profit margin</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Monthly</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{Math.round(totalRevenue / 12).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Monthly average revenue</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Monthly Revenue Breakdown</CardTitle>
            <CardDescription>Revenue, expenses, and profit for each month</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <FileText className="h-4 w-4" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              revenue: {
                label: "Revenue",
                color: "hsl(var(--chart-1))",
              },
              profit: {
                label: "Profit",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="revenue" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
