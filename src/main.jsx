import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router"
import App from "./App"
import RestaurantPage from "./pages/RestaurantPage"
import MenuItemDetailPage from "./pages/MenuItemDetailPage"
import "./index.css"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <RestaurantPage /> },
      { path: "menu-items/:id", element: <MenuItemDetailPage /> },
    ],
  },
])

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
