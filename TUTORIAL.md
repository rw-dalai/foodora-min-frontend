# SpengerBite Frontend — Tutorial

## Einleitung

Wir bauen das Frontend für **SpengerBite**, eine Food-Delivery-App (ähnlich Foodora). In diesem Tutorial erstellen wir eine React-App, die Restaurants und deren Speisekarten anzeigt.

### Was wir lernen

| Konzept | Beschreibung |
|---------|-------------|
| **Projektstruktur** | Pages, Components, API-Layer, lib/utils |
| **React Router** | URL-basierte Navigation, `useParams` |
| **Wiederverwendbare Komponenten** | shadcn/ui-basiert, wie Puzzle-Teile zusammengesetzt |
| **useState + useEffect** | State-Management, Daten laden beim Mounten |
| **API-Layer** | Axios (+ Fetch als Referenz), Error Handling |
| **Mock-API** | json-server — der API-Layer merkt nicht, dass kein echtes Backend läuft |
| **shadcn/ui + Tailwind CSS** | Fertige UI-Komponenten + Utility-Klassen |
| **App Shell** | Sidebar-Navigation, Top-Navbar, Mobile-First |

### Ordnerstruktur (Endergebnis)

```
foodora-min-frontend/
├── db.json                          ← Mock-Daten für json-server
├── package.json
├── vite.config.js                   ← Vite + Tailwind + Proxy
├── jsconfig.json                    ← @/-Alias für VS Code
├── components.json                  ← shadcn Konfiguration
├── public/
│   └── images/                      ← Pizza-Bilder
├── src/
│   ├── main.jsx                     ← Router-Setup + Einstiegspunkt
│   ├── index.css                    ← shadcn Theme (Tailwind)
│   ├── App.jsx                      ← Layout: Sidebar + TopNav + Outlet
│   ├── lib/
│   │   └── utils.js                 ← cn() Hilfsfunktion (shadcn)
│   ├── api/
│   │   └── restaurants.js           ← API-Layer (Axios)
│   ├── pages/
│   │   ├── RestaurantPage.jsx       ← Speisekarte als Grid
│   │   └── MenuItemDetailPage.jsx   ← DEINE AUFGABE
│   └── components/
│       ├── ui/                      ← shadcn Komponenten (auto-generiert)
│       ├── AppSidebar.jsx           ← Seitenleiste
│       ├── TopNav.jsx               ← Obere Navigationsleiste
│       └── MenuItemCard.jsx         ← Wiederverwendbare Karte
```

### Was du selbst implementierst

Am Ende dieses Tutorials fehlen zwei Dinge, die **du** als Aufgabe implementierst:
1. Die Funktion `getMenuItemById(id)` im API-Layer
2. Die `MenuItemDetailPage` — die Detailseite eines Menüpunkts

---

## Schritt 1: Projekt erstellen

```bash
npm create vite@latest foodora-min-frontend -- --template react
cd foodora-min-frontend
npm install
```

> Vite ist ein modernes Build-Tool für Frontend-Projekte. Es startet den Dev-Server in Millisekunden und unterstützt Hot Module Replacement (HMR) — Änderungen im Code werden sofort im Browser sichtbar.

---

## Schritt 2: Tailwind CSS installieren

```bash
npm install tailwindcss @tailwindcss/vite
npm install -D @types/node
```

Ersetze den Inhalt von `src/index.css` mit:

```css
@import "tailwindcss";
```

> **Tailwind CSS** ist ein Utility-First CSS-Framework. Statt eigene CSS-Klassen zu schreiben, verwendet man vordefinierte Klassen direkt im HTML: `className="text-2xl font-bold p-4"`. Das spart viel Zeit und hält den Code konsistent.

---

## Schritt 3: Path-Alias `@/` konfigurieren

Damit wir Imports so schreiben können:
```javascript
import { Button } from '@/components/ui/button'   // ✅ kurz & klar
// statt:
import { Button } from '../../../components/ui/button'   // ❌ hässlich
```

### vite.config.js

Ersetze die Datei komplett:

```javascript
import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

> Den **Proxy** fügen wir später in Schritt 6 hinzu.

### jsconfig.json

Erstelle diese Datei im **Projekt-Root** (nicht in `src/`):

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Warum an 2 Stellen?

| Datei | Zweck |
|-------|-------|
| `vite.config.js` | Vite löst `@` zur **Build-Zeit** auf |
| `jsconfig.json` | VS Code versteht `@` für **Autovervollständigung** |

Beide sind nötig — sonst funktioniert entweder der Build oder die IDE nicht.

---

## Schritt 4: shadcn/ui initialisieren

[shadcn/ui](https://ui.shadcn.com) ist eine Sammlung von fertigen, schön gestalteten React-Komponenten (Buttons, Cards, Inputs, ...). Die Komponenten werden direkt in dein Projekt kopiert — du kannst sie jederzeit anpassen.

```bash
npx shadcn@latest init -d
```

Das erstellt:
- `components.json` — shadcn-Konfiguration
- `src/lib/utils.js` — die `cn()` Hilfsfunktion zum Zusammenführen von CSS-Klassen
- Theme-Variablen in `src/index.css`

### Komponenten installieren

```bash
npx shadcn@latest add sidebar button card badge skeleton separator input avatar dropdown-menu
```

Das installiert 10 Komponenten in `src/components/ui/` (plus automatische Abhängigkeiten wie `sheet` und `tooltip`).

### Routing + HTTP-Client installieren

```bash
npm install react-router axios
```

| Paket | Zweck |
|-------|-------|
| **react-router** | URL-basierte Seitennavigation |
| **axios** | HTTP-Client für API-Aufrufe (Alternative zu `fetch`) |

---

## Schritt 5: Mock-API mit json-server

Unser Backend existiert noch nicht — aber wir wollen trotzdem echte HTTP-Aufrufe machen. **json-server** erstellt aus einer JSON-Datei automatisch eine REST-API.

```bash
npm install -D json-server
```

### db.json

Erstelle `db.json` im **Projekt-Root**:

```json
{
  "restaurants": [
    {
      "id": 1,
      "name": "Spenger Pizza",
      "address": { "street": "Spengergasse 1", "postalCode": "1050", "city": "Wien" }
    }
  ],
  "menu-items": [
    { "id": 1, "name": "Margherita", "price": 8.90, "description": "Classic tomato sauce, mozzarella, fresh basil", "image": "/images/margherita.jpg", "restaurantId": 1 },
    { "id": 2, "name": "Salami", "price": 10.40, "description": "Spicy Italian salami, mozzarella, tomato sauce", "image": "/images/salami.jpg", "restaurantId": 1 },
    { "id": 3, "name": "Funghi", "price": 11.20, "description": "Mixed mushrooms, garlic, mozzarella, truffle oil", "image": "/images/funghi.jpg", "restaurantId": 1 },
    { "id": 4, "name": "Quattro Formaggi", "price": 13.00, "description": "Mozzarella, gorgonzola, parmesan, fontina", "image": "/images/quattro-formaggi.jpg", "restaurantId": 1 },
    { "id": 5, "name": "Diavola", "price": 11.90, "description": "Spicy nduja, fresh chilli, mozzarella", "image": "/images/diavola.jpg", "restaurantId": 1 },
    { "id": 6, "name": "Prosciutto", "price": 12.50, "description": "Parma ham, arugula, parmesan shavings", "image": "/images/prosciutto.jpg", "restaurantId": 1 }
  ]
}
```

### npm Script hinzufügen

In `package.json` unter `"scripts"`:

```json
"mock-api": "json-server db.json --port 3001"
```

json-server erstellt automatisch diese Endpoints:
- `GET http://localhost:3001/menu-items` — alle Menüpunkte
- `GET http://localhost:3001/menu-items/1` — ein einzelner Menüpunkt
- `GET http://localhost:3001/menu-items?restaurantId=1` — Menüpunkte eines Restaurants

### Bilder

Lege 6 Pizza-Bilder in `public/images/` ab:
- `margherita.jpg`, `salami.jpg`, `funghi.jpg`, `quattro-formaggi.jpg`, `diavola.jpg`, `prosciutto.jpg`

> Dateien im `public/`-Ordner werden von Vite direkt unter `/` ausgeliefert. `public/images/margherita.jpg` ist also unter `http://localhost:5173/images/margherita.jpg` erreichbar.

### Warum json-server?

Der **API-Layer** (den wir in Schritt 9 schreiben) ruft `/api/menu-items` auf. Er weiß **nicht**, ob dahinter json-server oder ein echtes Spring-Boot-Backend steckt. Wenn das echte Backend fertig ist, ändern wir nur eine Zeile in der Proxy-Konfiguration — der gesamte restliche Code bleibt gleich.

---

## Schritt 6: Vite Proxy konfigurieren

Das Frontend läuft auf `localhost:5173`, json-server auf `localhost:3001`. Damit der Browser keine CORS-Fehler wirft, leiten wir `/api`-Aufrufe über den Vite-Dev-Server weiter.

Ergänze `vite.config.js` um den `server`-Block:

```javascript
import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
})
```

### Was passiert hier?

```
Browser ruft auf:    /api/menu-items?restaurantId=1
                          ↓ (Vite Proxy)
json-server erhält:  http://localhost:3001/menu-items?restaurantId=1
```

Der `rewrite` entfernt das `/api`-Präfix, weil json-server die Endpoints ohne `/api` bereitstellt. Im Code schreiben wir immer `/api/...` — das ist sauberer und entspricht dem echten Backend später.

---

## Schritt 7: React Router einrichten

**React Router** ermöglicht Seitennavigation innerhalb der App, ohne die Seite neu zu laden. Die **URL ist die Source of Truth** — jede Seite hat eine eigene URL.

### src/main.jsx

Ersetze die Datei komplett:

```jsx
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
```

### Wie funktioniert das?

| URL | Komponente | Beschreibung |
|-----|-----------|-------------|
| `/` | `<RestaurantPage />` | Startseite mit Speisekarte |
| `/menu-items/3` | `<MenuItemDetailPage />` | Detail eines Menüpunkts (`:id` = 3) |

- `<App />` ist das **Layout** (Sidebar + TopNav), das immer sichtbar bleibt
- `<Outlet />` in App.jsx rendert die jeweilige Seite je nach URL
- `:id` ist ein **URL-Parameter** — in der Komponente liest man ihn mit `useParams()`

---

## Schritt 8: App Shell (Layout)

Die App Shell besteht aus drei Teilen:
1. **AppSidebar** — Seitenleiste links (Navigation)
2. **TopNav** — Obere Leiste (Suchfeld, User-Avatar)
3. **App** — Setzt alles zusammen

### src/components/AppSidebar.jsx

```jsx
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
} from "@/components/ui/sidebar"

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
```

> Die shadcn **Sidebar** ist **mobile-first**: Auf kleinen Bildschirmen wird sie automatisch ausgeblendet und kann über den Hamburger-Button als Drawer geöffnet werden. Auf dem Desktop ist sie immer sichtbar.

### src/components/TopNav.jsx

```jsx
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Search, User } from "lucide-react"

function TopNav() {
  return (
    <header className="flex h-20 items-center justify-between border-b px-6 gap-4">
      {/* Links: Hamburger-Button + Trennlinie */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1 size-10 [&_svg]:!size-6" />
        <Separator orientation="vertical" className="h-8" />
      </div>

      {/* Mitte: Suchfeld (auf kleinen Bildschirmen ausgeblendet) */}
      <div className="hidden sm:flex flex-1 max-w-[75%]">
        <div className="relative w-full">
          <Search className="absolute left-3 top-3.5 size-7 text-muted-foreground" />
          <Input placeholder="Search menu..." className="pl-12 h-14 !text-2xl" />
        </div>
      </div>

      {/* Rechts: User-Avatar mit Dropdown */}
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
```

### src/App.jsx

Lösche `src/App.css` (wird nicht mehr benötigt) und ersetze `src/App.jsx`:

```jsx
import { Outlet } from "react-router"
import { SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import AppSidebar from "@/components/AppSidebar"
import TopNav from "@/components/TopNav"

function App() {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-1 flex-col min-h-screen">
          <TopNav />
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  )
}

export default App
```

### Wie hängt alles zusammen?

```
<SidebarProvider>              ← verwaltet Sidebar-State (offen/geschlossen)
  <AppSidebar />               ← Seitenleiste links
  <div>
    <TopNav />                 ← Obere Leiste
    <main>
      <Outlet />               ← ← ← HIER wird die aktuelle Seite eingesetzt
    </main>                         (je nach URL: RestaurantPage oder MenuItemDetailPage)
  </div>
</SidebarProvider>
```

---

## Schritt 9: API-Layer

Der API-Layer kapselt alle HTTP-Aufrufe an einem Ort. Die Komponenten wissen nicht, **woher** die Daten kommen — nur, dass sie eine Funktion aufrufen und Daten zurückbekommen.

### src/api/restaurants.js

Erstelle den Ordner `src/api/` und darin:

```javascript
import axios from "axios"

const api = axios.create({ baseURL: "/api" })

// --- FETCH VERSION (zum Vergleich) ---
// export async function getMenuItems(restaurantId) {
//   const res = await fetch(`/api/menu-items?restaurantId=${restaurantId}`)
//   if (!res.ok) throw new Error(`HTTP error: ${res.status}`)
//   return res.json()
// }

// --- AXIOS VERSION (aktiv) ---
export async function getMenuItems(restaurantId) {
  const { data } = await api.get("/menu-items", {
    params: { restaurantId },
  })
  return data
}

// AUFGABE: Implementiere diese Funktion!
export async function getMenuItemById(id) {
  // Hinweis: Verwende api.get(`/menu-items/${id}`)
  throw new Error("Not implemented yet!")
}
```

### Axios vs. Fetch

| | **fetch** (eingebaut) | **axios** (Library) |
|---|---|---|
| JSON parsen | Manuell: `res.json()` | Automatisch: `{ data }` |
| Error Handling | Nur Netzwerk-Fehler werfen | Auch HTTP-Fehler (4xx, 5xx) werfen |
| Query-Parameter | Manuell in URL | `params: { key: value }` |
| Base-URL | Jedes Mal schreiben | Einmal konfigurieren |

> Beide Versionen stehen in der Datei — die Fetch-Version ist auskommentiert, damit man den Unterschied sieht.

### Warum `/api` als Prefix?

Der Code ruft `/api/menu-items` auf. Der Vite-Proxy leitet das an json-server weiter (Schritt 6). Wenn später das echte Backend läuft, ändert man nur die Proxy-Konfiguration. **Der API-Layer selbst bleibt unverändert.**

---

## Schritt 10: Wiederverwendbare Komponente

Eine **Komponente** in React ist wie ein Puzzle-Teil — einmal gebaut, überall wiederverwendbar. `MenuItemCard` zeigt eine einzelne Pizza-Karte. Sie wird auf der RestaurantPage für jeden Menüpunkt verwendet.

### src/components/MenuItemCard.jsx

```jsx
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
```

### Schlüsselkonzepte

| Konzept | Erklärung |
|---------|-----------|
| **Props** | `{ item }` — die Komponente erhält Daten von außen (hier: ein Menüpunkt-Objekt) |
| **Link** | Klick navigiert zu `/menu-items/3` — ohne Seiten-Reload |
| **shadcn Card** | Fertige Karten-Komponente mit Header, Content, etc. |
| **Badge** | Kleines Label für den Preis |
| **Tailwind-Klassen** | `h-56` = Bildhöhe, `object-cover` = Bild füllt Container, `line-clamp-2` = max. 2 Zeilen Text |

---

## Schritt 11: Restaurant-Seite

Die Hauptseite lädt die Menüpunkte vom API-Layer und zeigt sie als responsives Grid an.

### src/pages/RestaurantPage.jsx

```jsx
import { useState, useEffect } from "react"
import { getMenuItems } from "@/api/restaurants"
import { Skeleton } from "@/components/ui/skeleton"
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
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
```

### Schlüsselkonzepte

**useState** — verwaltet Daten innerhalb einer Komponente:
```javascript
const [menuItems, setMenuItems] = useState([])   // Liste der Menüpunkte
const [loading, setLoading] = useState(true)      // Lade-Zustand
const [error, setError] = useState(null)          // Fehlermeldung
```

**useEffect** — führt Code aus, wenn die Komponente geladen wird:
```javascript
useEffect(() => {
  getMenuItems(1)           // API-Aufruf
    .then(setMenuItems)     // Daten speichern
    .catch(...)             // Fehler abfangen
    .finally(...)           // Loading beenden
}, [])                      // [] = nur beim ersten Rendern ausführen
```

**Responsives Grid** mit Tailwind:
```
grid-cols-1              → Mobile: 1 Spalte
md:grid-cols-2           → Tablet (≥768px): 2 Spalten
xl:grid-cols-3           → Desktop (≥1280px): 3 Spalten
```

**Skeleton** — Platzhalter, der während des Ladens angezeigt wird (statt leerem Bildschirm).

---

## Schritt 12: Starten & Testen

Du brauchst **zwei Terminals**:

**Terminal 1 — Mock-API starten:**
```bash
npm run mock-api
```

**Terminal 2 — Frontend starten:**
```bash
npm run dev
```

Öffne http://localhost:5173/ im Browser. Du solltest sehen:
- Sidebar mit "SpengerBite" und "Spenger Pizza"
- Suchfeld oben, User-Avatar rechts
- 6 Pizza-Karten im Grid
- Auf Mobile: Sidebar verschwindet, Hamburger-Button erscheint

Klicke auf eine Pizza-Karte → du kommst zu `/menu-items/1` → dort steht "TODO: Implement this page!"

---

## Deine Aufgabe

### Teil 1: API-Funktion implementieren

Öffne `src/api/restaurants.js` und implementiere `getMenuItemById`:

```javascript
export async function getMenuItemById(id) {
  // Hinweis: Verwende api.get(`/menu-items/${id}`)
  throw new Error("Not implemented yet!")
}
```

**Hinweise:**
- Schau dir `getMenuItems` als Vorlage an
- Der Endpoint ist `GET /api/menu-items/:id`
- Axios gibt die Daten in `{ data }` zurück

### Teil 2: Detail-Seite implementieren

Öffne `src/pages/MenuItemDetailPage.jsx` und ersetze den TODO-Bereich:

**Was du brauchst:**
1. **`useParams()`** — liest `:id` aus der URL (`/menu-items/3` → `id = "3"`)
2. **`useState`** — für `menuItem`, `loading`, `error`
3. **`useEffect`** — ruft `getMenuItemById(id)` auf, wenn die Seite geladen wird
4. **shadcn Card** — zeigt Name, Preis und Beschreibung an

**Gewünschtes Ergebnis:**
- URL `/menu-items/1` zeigt: "Margherita", "€ 8.90", "Classic tomato sauce, mozzarella, fresh basil"
- Ein "Back to menu"-Button navigiert zurück zur Startseite
- Loading- und Error-States werden behandelt

**Tipp:** Die Imports stehen bereits in der Datei — du musst nur die Logik innerhalb der Funktion schreiben.

---

## Bonus: Auf echtes Backend umschalten

Wenn das Spring-Boot-Backend (`foodora-min`) auf Port 8080 läuft, ändere **eine Zeile** in `vite.config.js`:

```javascript
// VORHER (json-server):
"/api": {
  target: "http://localhost:3001",
  changeOrigin: true,
  rewrite: (path) => path.replace(/^\/api/, ""),
}

// NACHHER (echtes Backend):
"/api": {
  target: "http://localhost:8080",
  changeOrigin: true,
}
```

Der Rest des Codes bleibt **komplett unverändert**. Das ist der Vorteil eines sauberen API-Layers.
