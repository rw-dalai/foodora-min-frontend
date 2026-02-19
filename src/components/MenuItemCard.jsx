import { Link } from "react-router"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

function MenuItemCard({ item }) {
  return (
    <Link to={`/menu-items/${item.id}`} className="block">
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="h-56 w-full object-cover"
        />
        <CardHeader>
          <CardTitle className="text-2xl">{item.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <p className="text-lg text-muted-foreground line-clamp-2">
            {item.description}
          </p>
          <Badge variant="secondary" className="ml-2 shrink-0 text-lg px-3 py-1">
            &euro; {item.price.toFixed(2)}
          </Badge>
        </CardContent>
      </Card>
    </Link>
  )
}

export default MenuItemCard
