"use client"

import {FC} from "react"
import { ILayoutProps } from "../layout"
import { SidebarProvider } from "@/components/dashboard/layout/SidebarContext"
import Navbar from "@/components/dashboard/layout/Navbar"
import Sidebar from "@/components/dashboard/layout/Sidebar"

const DashboardLayout:FC<ILayoutProps> = ({children}) =>{
    return(
         <SidebarProvider>
          <Navbar />
          <Sidebar />
          <main className="pt-14 sm:ml-64 transition-all">{children}</main>
        </SidebarProvider>
    )
}

export default DashboardLayout