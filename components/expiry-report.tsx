"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type ExpiryProduct = {
  id: string
  name: string
  batchNumber: string
  expiryDate: string
  stock: number
  value: number
  daysToExpiry: number
}

const expiryProducts: ExpiryProduct[] = [
  {
    id: "1",
    name: "Vitamin D3 Tablets",
    batchNumber: "VTD2024003",
    expiryDate: "2025-01-20",
    stock: 150,
    value: 34500,
    daysToExpiry: 21,
  },
  {
    id: "2",
    name: "Cough Syrup 100ml",
    batchNumber: "CGH2024002",
    expiryDate: "2025-02-10",
    stock: 85,
    value: 7225,
    daysToExpiry: 42,
  },
  {
    id: "3",
    name: "Pain Relief Gel",
    batchNumber: "PRG2024001",
    expiryDate: "2025-02-28",
    stock: 120,
    value: 18000,
    daysToExpiry: 60,
  },
  {
    id: "4",
    name: "Antacid Tablets",
    batchNumber: "ANT2024005",
    expiryDate: "2025-03-15",
    stock: 200,
    value: 12000,
    daysToExpiry: 75,
  },
  {
    id: "5",
    name: "Eye Drops",
    batchNumber: "EYE2024003",
    expiryDate: "2025-03-30",
    stock: 95,
    value: 23750,
    daysToExpiry: 90,
  },
]

export function ExpiryReport() {
  const [filter, setFilter] = useState("30")

  const filteredProducts = expiryProducts.filter((product) => {
    const days = Number.parseInt(filter)
    return product.daysToExpiry <= days
  })

  const totalValue = filteredProducts.reduce((sum, product) => sum + product.value, 0)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Products Expiring</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredProducts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">In next {filter} days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Stock Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">At risk of expiry</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Units</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredProducts.reduce((sum, p) => sum + p.stock, 0)}</div>
            <p className="text-xs text-muted-foreground mt-1">Units at risk</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Expiry Stock Report</CardTitle>
            <CardDescription>Products approaching expiry date</CardDescription>
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
          <Tabs value={filter} onValueChange={setFilter} className="space-y-4">
            <TabsList>
              <TabsTrigger value="30">Next 30 Days</TabsTrigger>
              <TabsTrigger value="60">Next 60 Days</TabsTrigger>
              <TabsTrigger value="90">Next 90 Days</TabsTrigger>
            </TabsList>

            <TabsContent value={filter}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Batch Number</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Value (₹)</TableHead>
                    <TableHead>Days to Expiry</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.batchNumber}</TableCell>
                      <TableCell>{product.expiryDate}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>₹{product.value.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant="default"
                          className={
                            product.daysToExpiry <= 30
                              ? "bg-red-100 text-red-800 hover:bg-red-100"
                              : product.daysToExpiry <= 60
                                ? "bg-orange-100 text-orange-800 hover:bg-orange-100"
                                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                          }
                        >
                          {product.daysToExpiry} days
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
