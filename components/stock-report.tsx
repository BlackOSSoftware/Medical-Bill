"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type OutOfStockProduct = {
  id: string
  name: string
  batchNumber: string
  lastPurchaseDate: string
  lastPurchaseQty: number
  supplier: string
}

const outOfStockProducts: OutOfStockProduct[] = [
  {
    id: "1",
    name: "Amoxicillin 250mg",
    batchNumber: "AMX2024002",
    lastPurchaseDate: "2024-11-15",
    lastPurchaseQty: 500,
    supplier: "MediSupply Inc",
  },
  {
    id: "2",
    name: "Ibuprofen 400mg",
    batchNumber: "IBU2024001",
    lastPurchaseDate: "2024-11-20",
    lastPurchaseQty: 300,
    supplier: "PharmaCorp Ltd",
  },
  {
    id: "3",
    name: "Antibiotic Cream",
    batchNumber: "ABC2024003",
    lastPurchaseDate: "2024-11-25",
    lastPurchaseQty: 150,
    supplier: "HealthPlus Pharma",
  },
  {
    id: "4",
    name: "Blood Pressure Monitor",
    batchNumber: "BPM2024001",
    lastPurchaseDate: "2024-12-01",
    lastPurchaseQty: 25,
    supplier: "MedTech Solutions",
  },
  {
    id: "5",
    name: "Diabetes Test Strips",
    batchNumber: "DTS2024002",
    lastPurchaseDate: "2024-12-05",
    lastPurchaseQty: 200,
    supplier: "DiabetesCare Ltd",
  },
]

export function StockReport() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Out of Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{outOfStockProducts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unique Suppliers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(outOfStockProducts.map((p) => p.supplier)).size}</div>
            <p className="text-xs text-muted-foreground mt-1">Suppliers to contact</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Last Purchase Units</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {outOfStockProducts.reduce((sum, p) => sum + p.lastPurchaseQty, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total units previously ordered</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Out of Stock Report</CardTitle>
            <CardDescription>Products that need to be restocked</CardDescription>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Batch Number</TableHead>
                <TableHead>Last Purchase Date</TableHead>
                <TableHead>Last Purchase Qty</TableHead>
                <TableHead>Supplier</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {outOfStockProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.batchNumber}</TableCell>
                  <TableCell>{product.lastPurchaseDate}</TableCell>
                  <TableCell>{product.lastPurchaseQty}</TableCell>
                  <TableCell>{product.supplier}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
