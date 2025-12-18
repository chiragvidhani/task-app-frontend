import { Toaster } from "@/components/ui/sonner"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

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