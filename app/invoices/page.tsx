import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { CustomerInvoiceList } from "@/components/customer-invoice-list"

export default function InvoicesPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-6">
          <CustomerInvoiceList />
        </main>
      </div>
    </div>
  )
}
