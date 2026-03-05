import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Search, User, UtensilsCrossed, PanelLeft } from "lucide-react"

function TopNav({ onToggleSidebar }) {
  return (
    <header className="flex h-20 items-center justify-between border-b px-6 gap-4">
      {/* Left: toggle button + mobile logo */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
          <PanelLeft className="size-5" />
        </Button>
        <Link to="/" className="flex items-center gap-2 font-bold text-lg md:hidden">
          <UtensilsCrossed className="size-5" />
          SpengerBite
        </Link>
      </div>

      {/* Center: search (hidden on small screens) */}
      <div className="hidden sm:flex flex-1 max-w-[75%]">
        <div className="relative w-full">
          <Search className="absolute left-3 top-3.5 size-7 text-muted-foreground" />
          <Input placeholder="Search menu..." className="pl-12 h-14 !text-2xl" />
        </div>
      </div>

      {/* Right: user avatar */}
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none">
          <Avatar className="size-10 cursor-pointer">
            <AvatarFallback>
              <User className="size-6" />
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled>Profile (coming soon)</DropdownMenuItem>
          <DropdownMenuItem disabled>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

export default TopNav
