"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Printer, Download, Save } from "lucide-react"
import { useStore, type InvoiceItem } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

export function NewInvoice() {
  const { toast } = useToast()
  const { products, addInvoice, updateProductStock, getNextInvoiceNumber } = useStore()
  const [customerName, setCustomerName] = useState("")
  const [customerContact, setCustomerContact] = useState("")
  const [customerAddress, setCustomerAddress] = useState("")
  const [items, setItems] = useState<InvoiceItem[]>([])
  const [discount, setDiscount] = useState(0)

  const availableProducts = products.filter((p) => p.status !== "expired" && p.stock > 0)

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        productId: "",
        productName: "",
        batchNumber: "",
        quantity: 1,
        rate: 0,
        gst: 0,
        gstAmount: 0,
        total: 0,
      },
    ])
  }

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value }

          // Recalculate totals when quantity, rate, or gst changes
          if (field === "quantity" || field === "rate" || field === "gst") {
            const subtotal = updated.quantity * updated.rate
            updated.gstAmount = (subtotal * updated.gst) / 100
            updated.total = subtotal + updated.gstAmount
          }

          return updated
        }
        return item
      }),
    )
  }

  const selectProduct = (id: string, productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (product) {
      setItems(
        items.map((item) => {
          if (item.id === id) {
            const subtotal = item.quantity * product.saleRate
            const gstAmount = (subtotal * product.gst) / 100
            return {
              ...item,
              productId: product.id,
              productName: product.name,
              batchNumber: product.batchNumber,
              rate: product.saleRate,
              gst: product.gst,
              gstAmount: gstAmount,
              total: subtotal + gstAmount,
            }
          }
          return item
        }),
      )
    }
  }

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.rate, 0)
  const totalGst = items.reduce((sum, item) => sum + item.gstAmount, 0)
  const discountAmount = (subtotal * discount) / 100
  const grandTotal = subtotal + totalGst - discountAmount

  const numberToWords = (num: number): string => {
    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"]
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ]

    if (num === 0) return "Zero"
    if (num < 10) return ones[num]
    if (num < 20) return teens[num - 10]
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "")
    if (num < 1000) return ones[Math.floor(num / 100)] + " Hundred" + (num % 100 ? " " + numberToWords(num % 100) : "")
    if (num < 100000)
      return numberToWords(Math.floor(num / 1000)) + " Thousand" + (num % 1000 ? " " + numberToWords(num % 1000) : "")
    return numberToWords(Math.floor(num / 100000)) + " Lakh" + (num % 100000 ? " " + numberToWords(num % 100000) : "")
  }

  const handleSaveInvoice = () => {
    if (!customerName || !customerContact || items.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in customer details and add at least one item.",
        variant: "destructive",
      })
      return
    }

    // Check if any product is out of stock
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId)
      if (product && product.stock < item.quantity) {
        toast({
          title: "Stock Error",
          description: `${product.name} has only ${product.stock} units in stock.`,
          variant: "destructive",
        })
        return
      }
    }

    const invoice = {
      id: Date.now().toString(),
      invoiceNumber: getNextInvoiceNumber(),
      customerName,
      customerContact,
      customerAddress,
      date: new Date().toISOString().split("T")[0],
      items,
      subtotal,
      totalGst,
      discount,
      discountAmount,
      grandTotal,
      status: "unpaid" as const,
      paidAmount: 0,
      createdBy: "Admin",
    }

    addInvoice(invoice)

    // Update product stock
    items.forEach((item) => {
      updateProductStock(item.productId, item.quantity)
    })

    toast({
      title: "Invoice Created",
      description: `Invoice ${invoice.invoiceNumber} has been created successfully.`,
    })

    // Reset form
    setCustomerName("")
    setCustomerContact("")
    setCustomerAddress("")
    setItems([])
    setDiscount(0)
  }

  const handlePrint = () => {
    toast({
      title: "Print Invoice",
      description: "Print functionality will be implemented.",
    })
  }

  const handleExport = () => {
    toast({
      title: "Export to Excel",
      description: "Export functionality will be implemented.",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Customer Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name *</Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerContact">Contact Number *</Label>
              <Input
                id="customerContact"
                value={customerContact}
                onChange={(e) => setCustomerContact(e.target.value)}
                placeholder="Enter contact number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerAddress">Address</Label>
              <Input
                id="customerAddress"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="Enter address"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Invoice Items</CardTitle>
          <Button onClick={addItem} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 items-end p-4 border rounded-lg">
                <div className="flex-1 space-y-2">
                  <Label>Product *</Label>
                  <Select value={item.productId} onValueChange={(value) => selectProduct(item.id, value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableProducts.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} (Stock: {product.stock})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-32 space-y-2">
                  <Label>Batch No.</Label>
                  <Input value={item.batchNumber} disabled className="bg-muted" />
                </div>

                <div className="w-24 space-y-2">
                  <Label>Qty *</Label>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, "quantity", Number.parseInt(e.target.value) || 1)}
                    min="1"
                  />
                </div>

                <div className="w-28 space-y-2">
                  <Label>Rate (₹)</Label>
                  <Input value={item.rate.toFixed(2)} disabled className="bg-muted" />
                </div>

                <div className="w-24 space-y-2">
                  <Label>GST %</Label>
                  <Input value={item.gst} disabled className="bg-muted" />
                </div>

                <div className="w-32 space-y-2">
                  <Label>Total (₹)</Label>
                  <Input value={item.total.toFixed(2)} disabled className="bg-muted font-semibold" />
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {items.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No items added. Click "Add Item" to start creating an invoice.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Invoice Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total GST:</span>
                <span className="font-medium">₹{totalGst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Discount:</span>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number.parseFloat(e.target.value) || 0)}
                    className="w-20 h-8"
                    min="0"
                    max="100"
                  />
                  <span className="font-medium">% (₹{discountAmount.toFixed(2)})</span>
                </div>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Grand Total:</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
              <div className="text-sm text-muted-foreground italic">
                Amount in words: {numberToWords(Math.floor(grandTotal))} Rupees Only
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSaveInvoice} className="flex-1 gap-2">
                <Save className="h-4 w-4" />
                Save Invoice
              </Button>
              <Button onClick={handlePrint} variant="outline" className="gap-2 bg-transparent">
                <Printer className="h-4 w-4" />
                Print
              </Button>
              <Button onClick={handleExport} variant="outline" className="gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
