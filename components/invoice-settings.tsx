"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

export function InvoiceSettings() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    invoicePrefix: "INV",
    startingNumber: "1001",
    defaultTax: "12",
    defaultDiscount: "0",
    showCompanyLogo: true,
    showTermsConditions: true,
    autoCalculateGst: true,
    termsConditions: "Payment due within 30 days. Late payments subject to 2% monthly interest.",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Settings saved",
      description: "Invoice settings have been updated successfully.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Settings</CardTitle>
        <CardDescription>Configure default invoice settings and preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoicePrefix">Invoice Prefix *</Label>
              <Input
                id="invoicePrefix"
                value={formData.invoicePrefix}
                onChange={(e) => setFormData({ ...formData, invoicePrefix: e.target.value })}
                required
                placeholder="INV"
              />
              <p className="text-xs text-muted-foreground">Example: INV-2024-001</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startingNumber">Starting Number *</Label>
              <Input
                id="startingNumber"
                value={formData.startingNumber}
                onChange={(e) => setFormData({ ...formData, startingNumber: e.target.value })}
                required
                placeholder="1001"
              />
              <p className="text-xs text-muted-foreground">Next invoice will start from this number</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultTax">Default Tax % *</Label>
              <Input
                id="defaultTax"
                type="number"
                value={formData.defaultTax}
                onChange={(e) => setFormData({ ...formData, defaultTax: e.target.value })}
                required
                min="0"
                max="100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultDiscount">Default Discount %</Label>
              <Input
                id="defaultDiscount"
                type="number"
                value={formData.defaultDiscount}
                onChange={(e) => setFormData({ ...formData, defaultDiscount: e.target.value })}
                min="0"
                max="100"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="showCompanyLogo">Show Company Logo</Label>
                <p className="text-sm text-muted-foreground">Display company logo on invoices</p>
              </div>
              <Switch
                id="showCompanyLogo"
                checked={formData.showCompanyLogo}
                onCheckedChange={(checked) => setFormData({ ...formData, showCompanyLogo: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="showTermsConditions">Show Terms & Conditions</Label>
                <p className="text-sm text-muted-foreground">Display terms and conditions on invoices</p>
              </div>
              <Switch
                id="showTermsConditions"
                checked={formData.showTermsConditions}
                onCheckedChange={(checked) => setFormData({ ...formData, showTermsConditions: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoCalculateGst">Auto Calculate GST</Label>
                <p className="text-sm text-muted-foreground">Automatically calculate GST based on product settings</p>
              </div>
              <Switch
                id="autoCalculateGst"
                checked={formData.autoCalculateGst}
                onCheckedChange={(checked) => setFormData({ ...formData, autoCalculateGst: checked })}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
