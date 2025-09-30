"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Product = {
  id: string
  name: string
  batchNumber: string
  expiryDate: string
  gst: number
  mrp: number
  purchaseRate: number
  saleRate: number
  stock: number
  supplier: string
  status: "in-stock" | "out-of-stock" | "expiring-soon" | "expired"
}

export type InvoiceItem = {
  id: string
  productId: string
  productName: string
  batchNumber: string
  quantity: number
  rate: number
  gst: number
  gstAmount: number
  total: number
}

export type Invoice = {
  id: string
  invoiceNumber: string
  customerName: string
  customerContact: string
  customerAddress: string
  date: string
  items: InvoiceItem[]
  subtotal: number
  totalGst: number
  discount: number
  discountAmount: number
  grandTotal: number
  status: "paid" | "unpaid" | "partial"
  paidAmount: number
  createdBy: string
}

const initialProducts: Product[] = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    batchNumber: "PCM2024001",
    expiryDate: "2025-12-31",
    gst: 12,
    mrp: 50,
    purchaseRate: 30,
    saleRate: 45,
    stock: 500,
    supplier: "PharmaCorp Ltd",
    status: "in-stock",
  },
  {
    id: "2",
    name: "Amoxicillin 250mg",
    batchNumber: "AMX2024002",
    expiryDate: "2025-03-15",
    gst: 12,
    mrp: 120,
    purchaseRate: 80,
    saleRate: 110,
    stock: 250,
    supplier: "MediSupply Inc",
    status: "in-stock",
  },
  {
    id: "3",
    name: "Vitamin D3 Tablets",
    batchNumber: "VTD2024003",
    expiryDate: "2025-01-20",
    gst: 18,
    mrp: 250,
    purchaseRate: 180,
    saleRate: 230,
    stock: 150,
    supplier: "HealthPlus Pharma",
    status: "expiring-soon",
  },
  {
    id: "4",
    name: "Insulin Injection",
    batchNumber: "INS2023004",
    expiryDate: "2024-11-30",
    gst: 5,
    mrp: 850,
    purchaseRate: 650,
    saleRate: 800,
    stock: 45,
    supplier: "DiabetesCare Ltd",
    status: "expired",
  },
  {
    id: "5",
    name: "Cough Syrup 100ml",
    batchNumber: "CGH2024005",
    expiryDate: "2026-06-30",
    gst: 18,
    mrp: 95,
    purchaseRate: 60,
    saleRate: 85,
    stock: 320,
    supplier: "PharmaCorp Ltd",
    status: "in-stock",
  },
]

type Store = {
  products: Product[]
  invoices: Invoice[]
  addProduct: (product: Product) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  updateProductStock: (id: string, quantity: number) => void
  addInvoice: (invoice: Invoice) => void
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void
  deleteInvoice: (id: string) => void
  getNextInvoiceNumber: () => string
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      products: initialProducts,
      invoices: [],

      addProduct: (product) => set((state) => ({ products: [...state.products, product] })),

      updateProduct: (id, product) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...product } : p)),
        })),

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      updateProductStock: (id, quantity) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id
              ? {
                  ...p,
                  stock: p.stock - quantity,
                  status: p.stock - quantity <= 0 ? "out-of-stock" : p.status,
                }
              : p,
          ),
        })),

      addInvoice: (invoice) => set((state) => ({ invoices: [...state.invoices, invoice] })),

      updateInvoice: (id, invoice) =>
        set((state) => ({
          invoices: state.invoices.map((inv) => (inv.id === id ? { ...inv, ...invoice } : inv)),
        })),

      deleteInvoice: (id) =>
        set((state) => ({
          invoices: state.invoices.filter((inv) => inv.id !== id),
        })),

      getNextInvoiceNumber: () => {
        const invoices = get().invoices
        if (invoices.length === 0) return "INV-2024-001"
        const lastInvoice = invoices[invoices.length - 1]
        const lastNumber = Number.parseInt(lastInvoice.invoiceNumber.split("-")[2])
        return `INV-2024-${String(lastNumber + 1).padStart(3, "0")}`
      },
    }),
    {
      name: "medical-billing-storage",
    },
  ),
)
