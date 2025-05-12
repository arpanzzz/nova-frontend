import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "sonner" // ✅ Import this
import { toast } from "sonner" // ✅ Import the toast function
import UserManagementTable from "@/components/user-management"

export default function Page() {
  return (
    
      
<>
        <UserManagementTable />
   </>   
  )
}