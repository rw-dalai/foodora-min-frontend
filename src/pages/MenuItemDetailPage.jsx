import { useState, useEffect } from "react"
import { useParams, Link } from "react-router"
import { getMenuItemById } from "@/api/restaurants"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft } from "lucide-react"

function MenuItemDetailPage() {
  // STUDENT TODO:
  // 1. Get the 'id' from the URL using useParams()
  // 2. Create state for the menuItem, loading, and error
  // 3. Use useEffect to call getMenuItemById(id) when the component mounts
  // 4. Display the item's name, price, and description using shadcn Card

  return (
    <div className="space-y-4">
      <Button variant="ghost" asChild>
        <Link to="/">
          <ArrowLeft className="size-4" /> Back to menu
        </Link>
      </Button>

      <p className="text-muted-foreground">TODO: Implement this page!</p>
    </div>
  )
}

export default MenuItemDetailPage
