import { useState, useEffect } from "react"
import { getMenuItems } from "@/api/restaurants"
import MenuItemCard from "@/components/MenuItemCard"

function RestaurantPage() {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getMenuItems(1)
      .then(setMenuItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (error) return <p className="text-destructive">Error: {error}</p>

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-4xl font-bold">Spenger Pizza</h2>
        <p className="text-lg text-muted-foreground">Spengergasse 1, 1050 Wien</p>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Laden...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}

export default RestaurantPage
