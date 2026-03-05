import { Link } from "react-router"
import { UtensilsCrossed, Pizza } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/Sidebar"

function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 h-20 flex items-center justify-center">
        <Link to="/" className="flex items-center gap-2 font-bold text-2xl">
          <UtensilsCrossed className="size-8" />
          SpengerBite
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg">Restaurants</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="text-lg py-4">
                  <Link to="/">
                    <Pizza className="size-6" /> Spenger Pizza
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar
