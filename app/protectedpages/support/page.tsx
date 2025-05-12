"use client"
import { useState } from "react"
import SupportForm from "@/components/support-form"
import SupportStatusTable from '../../../components/support-status-table';

export default function Page() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div>
              <SupportForm onSuccess={() => setRefreshKey(prev => prev + 1)} />
            </div>
            <SupportStatusTable key={refreshKey}/>
          </div>
        </div>
    
  )
}
