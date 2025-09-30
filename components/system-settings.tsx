"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Download, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function SystemSettings() {
  const { toast } = useToast()

  const handleBackup = () => {
    toast({
      title: "Backup initiated",
      description: "Your database backup has been started. You will be notified when complete.",
    })
  }

  const handleRestore = () => {
    toast({
      title: "Restore initiated",
      description: "Database restore process has been started.",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Database Management</CardTitle>
          <CardDescription>Backup and restore your database</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Backup Database</h3>
                <p className="text-sm text-muted-foreground">Create a backup of your entire database</p>
              </div>
            </div>
            <Button onClick={handleBackup} className="gap-2">
              <Download className="h-4 w-4" />
              Backup Now
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <Upload className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold">Restore Database</h3>
                <p className="text-sm text-muted-foreground">Restore database from a backup file</p>
              </div>
            </div>
            <Button onClick={handleRestore} variant="outline" className="gap-2 bg-transparent">
              <Upload className="h-4 w-4" />
              Restore
            </Button>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> Regular backups are recommended to prevent data loss. Backups are stored securely
              and can be restored at any time.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>View system details and version information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Application Version</span>
              <span className="text-sm font-medium">v1.0.0</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Database Version</span>
              <span className="text-sm font-medium">PostgreSQL 15.2</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Last Backup</span>
              <span className="text-sm font-medium">2024-12-19 10:30 AM</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-muted-foreground">Storage Used</span>
              <span className="text-sm font-medium">2.4 GB / 10 GB</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
