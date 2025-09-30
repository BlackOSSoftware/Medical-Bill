"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useStore } from "@/lib/store"
import { Printer, Download, CreditCard } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

type InvoiceDetailDialogProps = {
  invoiceId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InvoiceDetailDialog({ invoiceId, open, onOpenChange }: InvoiceDetailDialogProps) {
  const { toast } = useToast()
  const { invoices, updateInvoice } = useStore()
  const invoice = invoices.find((inv) => inv.id === invoiceId)
  const [paymentAmount, setPaymentAmount] = useState("")

  if (!invoice) return null

  const handlePayment = () => {
    const amount = Number.parseFloat(paymentAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid payment amount.",
        variant: "destructive",
      })
      return
    }

    const newPaidAmount = invoice.paidAmount + amount
    const newStatus = newPaidAmount >= invoice.grandTotal ? "paid" : newPaidAmount > 0 ? "partial" : "unpaid"

    updateInvoice(invoice.id, {
      paidAmount: newPaidAmount,
      status: newStatus,
    })

    toast({
      title: "Payment Recorded",
      description: `Payment of ₹${amount} has been recorded successfully.`,
    })

    setPaymentAmount("")
  }

  const remainingAmount = invoice.grandTotal - invoice.paidAmount

  const handlePrint = () => {
    if (!invoice) return

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Invoice Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invoice Header */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold">{invoice.invoiceNumber}</h3>
              <p className="text-sm text-muted-foreground">Date: {invoice.date}</p>
              <p className="text-sm text-muted-foreground">Created by: {invoice.createdBy}</p>
            </div>
            <Badge
              variant="secondary"
              className={
                invoice.status === "paid"
                  ? "bg-green-100 text-green-800"
                  : invoice.status === "partial"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-orange-100 text-orange-800"
              }
            >
              {invoice.status.toUpperCase()}
            </Badge>
          </div>

          <Separator />

          {/* Customer Details */}
          <div>
            <h4 className="font-semibold mb-2">Customer Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-medium">{invoice.customerName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Contact</p>
                <p className="font-medium">{invoice.customerContact}</p>
              </div>
              {invoice.customerAddress && (
                <div className="col-span-2">
                  <p className="text-muted-foreground">Address</p>
                  <p className="font-medium">{invoice.customerAddress}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Invoice Items */}
          <div>
            <h4 className="font-semibold mb-3">Items</h4>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3">Product</th>
                    <th className="text-left p-3">Batch</th>
                    <th className="text-right p-3">Qty</th>
                    <th className="text-right p-3">Rate</th>
                    <th className="text-right p-3">GST</th>
                    <th className="text-right p-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="p-3">{item.productName}</td>
                      <td className="p-3">{item.batchNumber}</td>
                      <td className="text-right p-3">{item.quantity}</td>
                      <td className="text-right p-3">₹{item.rate.toFixed(2)}</td>
                      <td className="text-right p-3">{item.gst}%</td>
                      <td className="text-right p-3 font-medium">₹{item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Invoice Summary */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-medium">₹{invoice.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total GST:</span>
              <span className="font-medium">₹{invoice.totalGst.toFixed(2)}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Discount ({invoice.discount}%):</span>
                <span className="font-medium">-₹{invoice.discountAmount.toFixed(2)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Grand Total:</span>
              <span>₹{invoice.grandTotal.toFixed(2)}</span>
            </div>
            {invoice.paidAmount > 0 && (
              <>
                <div className="flex justify-between text-sm text-green-600">
                  <span>Paid Amount:</span>
                  <span className="font-medium">₹{invoice.paidAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-orange-600">
                  <span>Remaining:</span>
                  <span className="font-medium">₹{remainingAmount.toFixed(2)}</span>
                </div>
              </>
            )}
          </div>

          {/* Payment Section */}
          {invoice.status !== "paid" && (
            <div className="border rounded-lg p-4 space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Record Payment
              </h4>
              <div className="flex gap-3">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="paymentAmount">Payment Amount</Label>
                  <Input
                    id="paymentAmount"
                    type="number"
                    placeholder="Enter amount"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    max={remainingAmount}
                  />
                  <p className="text-xs text-muted-foreground">Remaining: ₹{remainingAmount.toFixed(2)}</p>
                </div>
                <div className="flex items-end">
                  <Button onClick={handlePayment}>Record Payment</Button>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button className="flex-1 gap-2" onClick={handlePrint}>
              <Printer className="h-4 w-4" />
              Print Invoice
            </Button>
            <Button variant="outline" className="flex-1 gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
