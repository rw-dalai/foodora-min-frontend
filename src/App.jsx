import { useState } from "react"
import { Outlet } from "react-router"
import { SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "@/components/AppSidebar"
import TopNav from "@/components/TopNav"

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <SidebarProvider>
      {sidebarOpen && <AppSidebar />}
      <div className="flex flex-1 flex-col min-h-screen">
        <TopNav onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  )
}

export default App
