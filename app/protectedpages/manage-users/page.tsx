"use client";
import AssetTransferTable from '../../../components/asset-transfer-table';
import TransferAssetForm from "@/components/transfer-asset-form"
import IncomingTransfer from "@/components/incoming-transfers"
import { Toaster } from "sonner"; // ✅ Import this
import ProtectedRoute from "@/components/ProtectedRoute";
import EmployeeTable from '@/components/employee-table';
import AddUserHeader from '@/components/add-user-form';
import { useState } from "react"



export default function Page() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => setRefreshKey(prev => prev + 1)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <AddUserHeader onRefresh={handleRefresh} />
      <EmployeeTable refreshKey={refreshKey} />
    </div>
      
        
  )
}
