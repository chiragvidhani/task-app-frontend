import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "sonner"

export default function Layout({ children }) {
  return (
    <>
    <main className="h-screen w-full">
      {children}
    </main>
    <Toaster />
    </>
  )
}