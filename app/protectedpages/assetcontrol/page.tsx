"use client"
import AssetManagementTable from "@/components/asset-management-table"
import AddAssetForm from "@/components/add-asset-form"
import { useState } from "react"

export default function Page() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => setRefreshKey(prev => prev + 1)

  return (      
<div className="flex flex-1 flex-col">
        <AddAssetForm onRefresh={handleRefresh} />
        <AssetManagementTable refreshKey={refreshKey} />
   </div>   
  )
}