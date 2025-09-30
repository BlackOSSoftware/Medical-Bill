"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RevenueReport } from "@/components/revenue-report"
import { ExpiryReport } from "@/components/expiry-report"
import { StockReport } from "@/components/stock-report"
import { GstReport } from "@/components/gst-report"

export function ReportsTabs() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
        <p className="text-muted-foreground">View detailed reports and export data</p>
      </div>

      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="expiry">Expiry Stock</TabsTrigger>
          <TabsTrigger value="stock">Out of Stock</TabsTrigger>
          <TabsTrigger value="gst">GST Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <RevenueReport />
        </TabsContent>

        <TabsContent value="expiry">
          <ExpiryReport />
        </TabsContent>

        <TabsContent value="stock">
          <StockReport />
        </TabsContent>

        <TabsContent value="gst">
          <GstReport />
        </TabsContent>
      </Tabs>
    </div>
  )
}
