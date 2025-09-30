"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Pencil, Trash2 } from "lucide-react"
import { AddProductDialog } from "@/components/add-product-dialog"
import { useStore, type Product } from "@/lib/store"

export function ProductList() {
  const { products, addProduct, deleteProduct } = useStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusBadge = (status: Product["status"]) => {
    const variants = {
      "in-stock": {
        variant: "default" as const,
        label: "In Stock",
        className: "bg-green-100 text-green-800 hover:bg-green-100",
      },
      "out-of-stock": {
        variant: "secondary" as const,
        label: "Out of Stock",
        className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
      },
      "expiring-soon": {
        variant: "default" as const,
        label: "Expiring Soon",
        className: "bg-orange-100 text-orange-800 hover:bg-orange-100",
      },
      expired: {
        variant: "destructive" as const,
        label: "Expired",
        className: "bg-red-100 text-red-800 hover:bg-red-100",
      },
    }
    const config = variants[status]
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const getRowClassName = (status: Product["status"]) => {
    switch (status) {
      case "expired":
        return "bg-red-50/50"
      case "expiring-soon":
        return "bg-orange-50/50"
      case "out-of-stock":
        return "bg-gray-50/50"
      default:
        return ""
    }
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products & Inventory</h1>
          <p className="text-muted-foreground">Manage your medical products and stock levels</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by product name or batch number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Batch Number</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>GST %</TableHead>
              <TableHead>MRP</TableHead>
              <TableHead>Purchase Rate</TableHead>
              <TableHead>Sale Rate</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id} className={getRowClassName(product.status)}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.batchNumber}</TableCell>
                <TableCell>{product.expiryDate}</TableCell>
                <TableCell>{product.gst}%</TableCell>
                <TableCell>₹{product.mrp}</TableCell>
                <TableCell>₹{product.purchaseRate}</TableCell>
                <TableCell>₹{product.saleRate}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>{getStatusBadge(product.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddProductDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={(product) => {
          addProduct({ ...product, id: Date.now().toString() })
          setIsAddDialogOpen(false)
        }}
      />
    </div>
  )
}
