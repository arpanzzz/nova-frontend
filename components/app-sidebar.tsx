"use client"

import * as React from "react"
import {
  IconAsset,
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileCheck,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconSettings2,
  IconUser,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: (sessionStorage.getItem("EmpName") || "GUEST").replace(/^"|"$/g, "").replace(/^./, c => c.toUpperCase()),
    email: (sessionStorage.getItem("EmpNo") || "").replace(/^"|"$/g, "").replace(/^./, c => c.toUpperCase()),
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Transfer Asset",  
      url: "/protectedpages/asset-transfer",
      icon: IconAsset,
    },
    // {
    //   title: "Support",
    //   url: "#",
    //   icon: IconUsers,
    // },
    
  ],

  admin: [
    {
      name: "Manage Users",
      url: "/protectedpages/admin/users",
      icon: IconUser,
    },
    {
      name: "Manage Assets",
      url: "/protectedpages/admin/assets",
      icon: IconAsset,
    },
    {
      name: "Approve Transfers",
      url: "/protectedpages/admin/transfers",
      icon: IconFileCheck,
    },
    {
      name: "Issue Register",
      url: "/protectedpages/admin/issue-register",
      icon: IconFolder,
    },
    {
      name: "Services",
      url: "/protectedpages/admin/services",
      icon: IconSettings2,
    },
  ],
}

console.log("User Role:", sessionStorage.getItem("role"))

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Nova.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {sessionStorage.getItem("role") == `"admin"` && <NavDocuments items={data.admin} />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
