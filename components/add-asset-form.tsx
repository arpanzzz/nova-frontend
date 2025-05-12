"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

const apiUrl = process.env.NEXT_PUBLIC_API_URL;


export default function AddAssetForm({ onRefresh }: { onRefresh?: () => void }) {
  const [showForm, setShowForm] = useState(false)

  const [formData, setFormData] = useState({
    AssetCode: "",
    AssetERP_Code: "",
    AssetType: "",
    AssetDescription: "",
    PurchaseDate: "",
    OwnerCompany: "",
    PurchaseEmployeeName: "",
    PoNo: "",
    PoDate: "",
    PurchasedPrice: 0,
    VendorName: "",
    WarrantyDate: "",
    IsIssued: 0,
    UserContNo: "",
    UserCompany: "",
    IssuedDate: "",
    IssuedSite: "",
    IsActive: 1,
    IsScrraped: false,
    ScrapedDate: "",
    Remarks1: "",
    Remarks2: "",
    Remarks3: "",
    AssetBrand: "",
    AssetModel: "",
    AssetSlno: "",
    Location: "",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target
    const parsedValue =
      type === "number" ? Number(value) : type === "checkbox" ? checked : value
    setFormData({ ...formData, [name]: parsedValue })
  }

  const handleDateChange = (name: string, date: Date | undefined) => {
    setFormData({
      ...formData,
      [name]: date ? format(date, "yyyy-MM-dd") : "",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = sessionStorage.getItem("token")

    try {
      const res = await fetch(`${apiUrl}/manage-asset/add-asset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Failed to add asset")

      toast.success("Asset added successfully")
      onRefresh?.()
    } catch (error) {
      toast.error("Failed to add asset", {
        description: (error as Error).message,
      })
    }
  }

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto py-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Add New Asset</h3>
          <p className="text-sm text-muted-foreground">
            Enter details of the asset to add it to the system.
          </p>
        </div>
        <div className="space-x-2">
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? "Hide Form" : "Add Asset"}
          </Button>
          <Button onClick={onRefresh} variant="outline">
            Refresh Assets
          </Button>
        </div>
      </div>

      {showForm && (
        <Card className="p-6 space-y-6">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
          >
            {Object.entries(formData).map(([key, value]) => {
              const isTextarea =
                key.toLowerCase().includes("remarks") ||
                key.toLowerCase().includes("description")
              const isCheckbox = typeof value === "boolean"
              const isNumber = typeof value === "number" && !isCheckbox
              const isDate = key.toLowerCase().includes("date")

              return (
                <div key={key} className="space-y-2 col-span-1">
                  <Label htmlFor={key}>{key}</Label>

                  {isTextarea ? (
                    <Textarea
                      id={key}
                      name={key}
                      value={value}
                      placeholder={`Enter ${key.replace(/([A-Z])/g, " $1").trim()}`}
                      onChange={handleChange}
                    />
                  ) : isCheckbox ? (
                    <input
                      type="checkbox"
                      id={key}
                      name={key}
                      checked={value as boolean}
                      onChange={handleChange}
                    />
                  ) : isDate ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !value && "text-muted-foreground"
                          )}
                        >
                          {value ? format(new Date(value), "PPP") : `Pick ${key.replace(/([A-Z])/g, " $1").trim()}`}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={value ? new Date(value) : undefined}
                          onSelect={(date) => handleDateChange(key, date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <Input
                      type={isNumber ? "number" : "text"}
                      id={key}
                      name={key}
                      value={value}
                      placeholder={`Enter ${key.replace(/([A-Z])/g, " $1").trim()}`}
                      onChange={handleChange}
                    />
                  )}
                </div>
              )
            })}

            <div className="col-span-full">
              <Button
                type="submit"
                className="w-full bg-black text-white hover:bg-neutral-900"
              >
                Add Asset
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  )
}
