"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Eye, Printer, Download, Filter, Calendar } from "lucide-react"
import { useStore } from "@/lib/store"
import { InvoiceDetailDialog } from "@/components/invoice-detail-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function CustomerInvoiceList() {
  const { invoices } = useStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null)

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customerContact.includes(searchQuery)
    const matchesDateFrom = !dateFrom || invoice.date >= dateFrom
    const matchesDateTo = !dateTo || invoice.date <= dateTo
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter
    return matchesSearch && matchesDateFrom && matchesDateTo && matchesStatus
  })

  const handlePrint = (invoiceId: string) => {
    const invoice = invoices.find((inv) => inv.id === invoiceId)
    if (!invoice) return

    // Create a new window for printing
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoice.invoiceNumber}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; padding: 40px; color: #000; }
            .invoice-header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 20px; }
            .company-name { font-size: 28px; font-weight: bold; margin-bottom: 5px; }
            .invoice-title { font-size: 20px; color: #666; }
            .invoice-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .info-section { flex: 1; }
            .info-label { font-weight: bold; margin-bottom: 5px; }
            .info-value { margin-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { background: #f0f0f0; padding: 12px; text-align: left; border: 1px solid #ddd; font-weight: bold; }
            td { padding: 10px; border: 1px solid #ddd; }
            .text-right { text-align: right; }
            .summary { margin-top: 30px; float: right; width: 300px; }
            .summary-row { display: flex; justify-content: space-between; padding: 8px 0; }
            .summary-row.total { font-size: 18px; font-weight: bold; border-top: 2px solid #000; margin-top: 10px; padding-top: 10px; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; }
            .status-badge { display: inline-block; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; }
            .status-paid { background: #d4edda; color: #155724; }
            .status-unpaid { background: #fff3cd; color: #856404; }
            .status-partial { background: #d1ecf1; color: #0c5460; }
            @media print {
              body { padding: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-header">
            <div class="company-name">MediBill - Medical Billing System</div>
            <div class="invoice-title">TAX INVOICE</div>
          </div>

          <div class="invoice-info">
            <div class="info-section">
              <div class="info-label">Invoice Number:</div>
              <div class="info-value">${invoice.invoiceNumber}</div>
              <div class="info-label">Date:</div>
              <div class="info-value">${invoice.date}</div>
              <div class="info-label">Status:</div>
              <div class="info-value">
                <span class="status-badge status-${invoice.status}">${invoice.status.toUpperCase()}</span>
              </div>
            </div>
            <div class="info-section">
              <div class="info-label">Bill To:</div>
              <div class="info-value"><strong>${invoice.customerName}</strong></div>
              <div class="info-label">Contact:</div>
              <div class="info-value">${invoice.customerContact}</div>
              ${invoice.customerAddress ? `<div class="info-label">Address:</div><div class="info-value">${invoice.customerAddress}</div>` : ""}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Product Name</th>
                <th>Batch No.</th>
                <th class="text-right">Qty</th>
                <th class="text-right">Rate (₹)</th>
                <th class="text-right">GST %</th>
                <th class="text-right">GST Amount (₹)</th>
                <th class="text-right">Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items
                .map(
                  (item, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.productName}</td>
                  <td>${item.batchNumber}</td>
                  <td class="text-right">${item.quantity}</td>
                  <td class="text-right">${item.rate.toFixed(2)}</td>
                  <td class="text-right">${item.gst}%</td>
                  <td class="text-right">${item.gstAmount.toFixed(2)}</td>
                  <td class="text-right"><strong>${item.total.toFixed(2)}</strong></td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>

          <div class="summary">
            <div class="summary-row">
              <span>Subtotal:</span>
              <span>₹${invoice.subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
              <span>Total GST:</span>
              <span>₹${invoice.totalGst.toFixed(2)}</span>
            </div>
            ${invoice.discount > 0 ? `<div class="summary-row"><span>Discount (${invoice.discount}%):</span><span>-₹${invoice.discountAmount.toFixed(2)}</span></div>` : ""}
            <div class="summary-row total">
              <span>Grand Total:</span>
              <span>₹${invoice.grandTotal.toFixed(2)}</span>
            </div>
            ${invoice.paidAmount > 0 ? `<div class="summary-row" style="color: green;"><span>Paid Amount:</span><span>₹${invoice.paidAmount.toFixed(2)}</span></div>` : ""}
            ${invoice.paidAmount < invoice.grandTotal ? `<div class="summary-row" style="color: orange;"><span>Balance Due:</span><span>₹${(invoice.grandTotal - invoice.paidAmount).toFixed(2)}</span></div>` : ""}
          </div>

          <div style="clear: both;"></div>

          <div class="footer">
            <p>Thank you for your business!</p>
            <p>This is a computer-generated invoice and does not require a signature.</p>
            <p>Generated by: ${invoice.createdBy} | Generated on: ${new Date().toLocaleString()}</p>
          </div>

          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  const handleDownload = (invoiceId: string) => {
    const invoice = invoices.find((inv) => inv.id === invoiceId)
    if (!invoice) return

    // Create CSV content
    const csvContent = [
      ["Invoice Number", invoice.invoiceNumber],
      ["Customer Name", invoice.customerName],
      ["Contact", invoice.customerContact],
      ["Address", invoice.customerAddress || "N/A"],
      ["Date", invoice.date],
      ["Status", invoice.status],
      [],
      ["S.No", "Product", "Batch", "Qty", "Rate", "GST%", "GST Amount", "Total"],
      ...invoice.items.map((item, index) => [
        index + 1,
        item.productName,
        item.batchNumber,
        item.quantity,
        item.rate.toFixed(2),
        item.gst,
        item.gstAmount.toFixed(2),
        item.total.toFixed(2),
      ]),
      [],
      ["Subtotal", "", "", "", "", "", "", invoice.subtotal.toFixed(2)],
      ["Total GST", "", "", "", "", "", "", invoice.totalGst.toFixed(2)],
      ["Discount", "", "", "", "", "", "", invoice.discountAmount.toFixed(2)],
      ["Grand Total", "", "", "", "", "", "", invoice.grandTotal.toFixed(2)],
      ["Paid Amount", "", "", "", "", "", "", invoice.paidAmount.toFixed(2)],
      ["Balance", "", "", "", "", "", "", (invoice.grandTotal - invoice.paidAmount).toFixed(2)],
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${invoice.invoiceNumber}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      paid: {
        className: "bg-green-100 text-green-800 hover:bg-green-100",
        label: "Paid",
      },
      unpaid: {
        className: "bg-orange-100 text-orange-800 hover:bg-orange-100",
        label: "Unpaid",
      },
      partial: {
        className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
        label: "Partial",
      },
    }
    const config = variants[status as keyof typeof variants]
    return (
      <Badge variant="secondary" className={config.className}>
        {config.label}
      </Badge>
    )
  }

  // Calculate statistics
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0)
  const totalPaid = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0)
  const totalPending = totalRevenue - totalPaid
  const paidInvoices = invoices.filter((inv) => inv.status === "paid").length
  const unpaidInvoices = invoices.filter((inv) => inv.status === "unpaid").length
  const partialInvoices = invoices.filter((inv) => inv.status === "partial").length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Customer Invoice List</h1>
        <p className="text-muted-foreground">View and manage all customer invoices with complete details</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoices.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {paidInvoices} paid, {unpaidInvoices} unpaid, {partialInvoices} partial
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-green-600 mt-1">Total billed amount</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Amount Received</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{totalPaid.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((totalPaid / totalRevenue) * 100 || 0).toFixed(1)}% collected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">₹{totalPending.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Outstanding balance</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by invoice, customer name or contact..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-40"
                placeholder="From date"
              />
              <span className="text-muted-foreground">to</span>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-40"
                placeholder="To date"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice No.</TableHead>
                <TableHead>Customer Details</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items Purchased</TableHead>
                <TableHead className="text-right">Total Amount</TableHead>
                <TableHead className="text-right">Paid</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                    No invoices found. Create your first invoice to get started.
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{invoice.customerName}</div>
                        <div className="text-xs text-muted-foreground">{invoice.customerContact}</div>
                        {invoice.customerAddress && (
                          <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {invoice.customerAddress}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{invoice.items.length} items</div>
                        <div className="text-xs text-muted-foreground">
                          {invoice.items
                            .slice(0, 2)
                            .map((item) => item.productName)
                            .join(", ")}
                          {invoice.items.length > 2 && "..."}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold">₹{invoice.grandTotal.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-green-600">₹{invoice.paidAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-orange-600">
                      ₹{(invoice.grandTotal - invoice.paidAmount).toLocaleString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedInvoiceId(invoice.id)}
                          title="View Invoice"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePrint(invoice.id)}
                          title="Print Invoice"
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownload(invoice.id)}
                          title="Download CSV"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedInvoiceId && (
        <InvoiceDetailDialog
          invoiceId={selectedInvoiceId}
          open={!!selectedInvoiceId}
          onOpenChange={(open) => !open && setSelectedInvoiceId(null)}
        />
      )}
    </div>
  )
}
