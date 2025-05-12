"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export default function SupportContactForm({ onSuccess }: { onSuccess?: () => void }) {
  const [formData, setFormData] = useState({
    assetCode: "",
    assetType: "",
    issueType: "",
    issueDetails: "",
    callStatus: "Open", // Default CallStatus
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const token = sessionStorage.getItem("token") // Assuming the token is saved in sessionStorage

    const requestBody = {
      AssetCode: formData.assetCode,
      CallRegDate: new Date().toISOString(), // Timestamp when form is submitted
      AssetType: formData.assetType,
      IssueType: formData.issueType,
      IssueDetails: formData.issueDetails,
      CallStatus: formData.callStatus,
    }

    try {
      const response = await fetch("http://localhost:4000/manage-call-log/add-call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error("Error submitting the request")
      }

      toast.success("Request submitted successfully", {
        description: "Our team will review and respond shortly.",
      })
      onSuccess?.() 
    } catch (error) {
      toast.error("There was an error submitting the request", {
        description: error.message,
      })
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-6">
      <div>
        <h3 className="text-lg font-medium">Support Contact Form</h3>
        <p className="text-sm text-muted-foreground">Let us know if you're facing an issue or need assistance with a device.</p>
      </div>

      <Card className="p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="assetCode">Asset Code</Label>
            <Input
              id="assetCode"
              name="assetCode"
              placeholder="e.g. AST00001"
              value={formData.assetCode}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assetType">Asset Type</Label>
            <Select
              value={formData.assetType}
              onValueChange={(val) => setFormData({ ...formData, assetType: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Asset Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Laptop">Laptop</SelectItem>
                <SelectItem value="Desktop">Desktop</SelectItem>
                <SelectItem value="Monitor">Monitor</SelectItem>
                <SelectItem value="Phone">Phone</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="issueType">Issue Type</Label>
            <Select
              value={formData.issueType}
              onValueChange={(val) => setFormData({ ...formData, issueType: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Issue Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Hardware">Hardware</SelectItem>
                <SelectItem value="Software">Software</SelectItem>
                <SelectItem value="Connectivity">Connectivity</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="issueDetails">Issue Details</Label>
            <Textarea
              id="issueDetails"
              name="issueDetails"
              placeholder="Describe the problem you're experiencing..."
              value={formData.issueDetails}
              onChange={handleChange}
            />
          </div>

          <Button type="submit" className="bg-black text-white hover:bg-neutral-900">
            Submit Request
          </Button>
        </form>
      </Card>
    </div>
  )
}
