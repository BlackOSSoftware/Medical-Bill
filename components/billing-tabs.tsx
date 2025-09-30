"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NewInvoice } from "@/components/new-invoice"
import { InvoiceList } from "@/components/invoice-list"

export function BillingTabs() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Invoicing</h1>
        <p className="text-muted-foreground">Create and manage invoices for your customers</p>
      </div>

      <Tabs defaultValue="new" className="space-y-6">
        <TabsList>
          <TabsTrigger value="new">New Invoice</TabsTrigger>
          <TabsTrigger value="list">Invoice List</TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="space-y-4">
          <NewInvoice />
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <InvoiceList />
        </TabsContent>
      </Tabs>
    </div>
  )
}
