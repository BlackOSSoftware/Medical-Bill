"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

type GstData = {
  month: string
  gst5: number
  gst12: number
  gst18: number
  gst28: number
  total: number
}

const gstMonthlyData: GstData[] = [
  { month: "Jan", gst5: 5000, gst12: 12000, gst18: 18000, gst28: 8000, total: 43000 },
  { month: "Feb", gst5: 5500, gst12: 13000, gst18: 19000, gst28: 8500, total: 46000 },
  { month: "Mar", gst5: 5200, gst12: 12500, gst18: 18500, gst28: 8200, total: 44400 },
  { month: "Apr", gst5: 6000, gst12: 14000, gst18: 20000, gst28: 9000, total: 49000 },
  { month: "May", gst5: 5800, gst12: 13500, gst18: 19500, gst28: 8700, total: 47500 },
  { month: "Jun", gst5: 6200, gst12: 14500, gst18: 21000, gst28: 9300, total: 51000 },
]

export function GstReport() {
  const totalGst = gstMonthlyData.reduce((sum, item) => sum + item.total, 0)
  const avgMonthly = Math.round(totalGst / gstMonthlyData.length)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total GST Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalGst.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Last 6 months</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">GST 5%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{gstMonthlyData.reduce((sum, item) => sum + item.gst5, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Essential medicines</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">GST 12%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{gstMonthlyData.reduce((sum, item) => sum + item.gst12, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Standard medicines</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">GST 18%+</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{gstMonthlyData.reduce((sum, item) => sum + item.gst18 + item.gst28, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Premium products</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Monthly GST Breakdown</CardTitle>
            <CardDescription>GST collection by rate category</CardDescription>
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
              gst5: {
                label: "GST 5%",
                color: "hsl(var(--chart-1))",
              },
              gst12: {
                label: "GST 12%",
                color: "hsl(var(--chart-2))",
              },
              gst18: {
                label: "GST 18%",
                color: "hsl(var(--chart-3))",
              },
              gst28: {
                label: "GST 28%",
                color: "hsl(var(--chart-4))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gstMonthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="gst5" stackId="a" fill="hsl(var(--chart-1))" radius={[0, 0, 0, 0]} />
                <Bar dataKey="gst12" stackId="a" fill="hsl(var(--chart-2))" radius={[0, 0, 0, 0]} />
                <Bar dataKey="gst18" stackId="a" fill="hsl(var(--chart-3))" radius={[0, 0, 0, 0]} />
                <Bar dataKey="gst28" stackId="a" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detailed GST Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead>GST 5%</TableHead>
                <TableHead>GST 12%</TableHead>
                <TableHead>GST 18%</TableHead>
                <TableHead>GST 28%</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gstMonthlyData.map((data) => (
                <TableRow key={data.month}>
                  <TableCell className="font-medium">{data.month}</TableCell>
                  <TableCell>₹{data.gst5.toLocaleString()}</TableCell>
                  <TableCell>₹{data.gst12.toLocaleString()}</TableCell>
                  <TableCell>₹{data.gst18.toLocaleString()}</TableCell>
                  <TableCell>₹{data.gst28.toLocaleString()}</TableCell>
                  <TableCell className="font-bold">₹{data.total.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
