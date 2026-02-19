import axios from "axios"

const api = axios.create({ baseURL: "/api" })

// --- FETCH VERSION (for reference) ---
// export async function getMenuItems(restaurantId) {
//   const res = await fetch(`/api/menu-items?restaurantId=${restaurantId}`)
//   if (!res.ok) throw new Error(`HTTP error: ${res.status}`)
//   return res.json()
// }

// --- AXIOS VERSION (active) ---
export async function getMenuItems(restaurantId) {
  const { data } = await api.get("/menu-items", {
    params: { restaurantId },
  })
  return data
}

// STUDENT TODO: fetch a single menu item by its ID
export async function getMenuItemById(id) {
  // Hint: use api.get(`/menu-items/${id}`)
  throw new Error("Not implemented yet!")
}
