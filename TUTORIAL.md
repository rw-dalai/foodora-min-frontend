# SpengerBite Frontend: Tutorial

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
| **Mock-API** | json-server: der API-Layer merkt nicht, dass kein echtes Backend läuft |
| **shadcn/ui + Tailwind CSS** | Fertige UI-Komponenten + Utility-Klassen |
| **App Shell** | Eigene Sidebar-Bausteine, Top-Navbar mit Toggle-Button |

### Ordnerstruktur (Endergebnis)

```
foodora-min-frontend/
├── db.json                          <- Mock-Daten für json-server
├── package.json
├── vite.config.js                   <- Vite + Tailwind + Proxy
├── jsconfig.json                    <- @/-Alias für VS Code
├── components.json                  <- shadcn Konfiguration
├── public/
│   └── images/                      <- Pizza-Bilder
├── src/
│   ├── main.jsx                     <- Router-Setup + Einstiegspunkt
│   ├── index.css                    <- shadcn Theme (Tailwind)
│   ├── App.jsx                      <- Layout: Sidebar + TopNav + Outlet
│   ├── lib/
│   │   └── utils.js                 <- cn() Hilfsfunktion (shadcn)
│   ├── api/
│   │   └── restaurants.js           <- API-Layer (Axios)
│   ├── pages/
│   │   ├── RestaurantPage.jsx       <- Speisekarte als Grid
│   │   └── MenuItemDetailPage.jsx   <- DEINE AUFGABE
│   └── components/
│       ├── ui/                      <- shadcn + eigene UI-Komponenten
│       ├── AppSidebar.jsx           <- Seitenleiste
│       ├── TopNav.jsx               <- Obere Navigationsleiste
│       └── MenuItemCard.jsx         <- Wiederverwendbare Karte
```

### Was du selbst implementierst

Am Ende dieses Tutorials fehlen zwei Dinge, die **du** als Aufgabe implementierst:
1. Die Funktion `getMenuItemById(id)` im API-Layer
2. Die `MenuItemDetailPage`, die Detailseite eines Menüpunkts

---

# Teil 1: Projekt-Setup

In den ersten vier Schritten erstellen wir das Projektgerüst: Vite als Build-Tool, Tailwind CSS für das Styling, einen Import-Alias für saubere Pfade und shadcn/ui als Komponentenbibliothek.

---

## Schritt 1: Projekt erstellen

```bash
npm create vite@latest foodora-min-frontend -- --template react
cd foodora-min-frontend
npm install
```

> Vite ist ein modernes Build-Tool für Frontend-Projekte. Es startet den Dev-Server in Millisekunden und unterstützt Hot Module Replacement (HMR). Änderungen im Code werden sofort im Browser sichtbar.

### Schlüsselkonzepte

| Was | Wie | Warum |
|-----|-----|-------|
| Vite | `npm create vite@latest` mit `--template react` | Schneller Dev-Server, startet in Millisekunden |
| HMR | Vite erkennt Dateiänderungen automatisch | Code-Änderungen sofort im Browser sichtbar, kein Reload nötig |

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

### Schlüsselkonzepte

| Was | Wie | Warum |
|-----|-----|-------|
| Tailwind CSS | Utility-Klassen direkt im HTML: `className="text-2xl p-4"` | Kein eigenes CSS nötig, konsistentes Design |
| `@import "tailwindcss"` | Eine Zeile in `index.css` | Tailwind scannt den Code und generiert nur verwendete Klassen |

---

## Schritt 3: Path-Alias `@/` konfigurieren

Damit wir Imports so schreiben können:
```javascript
import { Button } from '@/components/ui/button'   // kurz & klar
// statt:
import { Button } from '../../../components/ui/button'   // hässlich
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

### Was passiert hier?

| Datei | Zweck |
|-------|-------|
| `vite.config.js` | Vite löst `@` zur **Build-Zeit** auf |
| `jsconfig.json` | VS Code versteht `@` für **Autovervollständigung** |

Beide sind nötig. Sonst funktioniert entweder der Build oder die IDE nicht.

### Schlüsselkonzepte

| Was | Wie | Warum |
|-----|-----|-------|
| Path-Alias `@/` | `vite.config.js` (Build) + `jsconfig.json` (IDE) | Saubere Imports statt `../../..` |
| Dual-Config | Vite braucht den Alias für den Build, VS Code für Autovervollständigung | Beide Tools müssen den Alias unabhängig kennen |

---

## Schritt 4: shadcn/ui initialisieren

[shadcn/ui](https://ui.shadcn.com) ist eine Sammlung von fertigen, schön gestalteten React-Komponenten (Buttons, Cards, Inputs, ...). Die Komponenten werden direkt in dein Projekt kopiert. Du kannst sie jederzeit anpassen.

```bash
npx shadcn@latest init -d
```

Das erstellt:
1. `components.json`: shadcn-Konfiguration
2. `src/lib/utils.js`: die `cn()` Hilfsfunktion zum Zusammenführen von CSS-Klassen
3. Theme-Variablen in `src/index.css`

### Komponenten installieren

```bash
npx shadcn@latest add button card badge separator input avatar dropdown-menu
```

Das installiert 7 Komponenten in `src/components/ui/`. Die Sidebar bauen wir in Schritt 8 selbst, so verstehen wir jede Zeile.

### Routing + HTTP-Client installieren

```bash
npm install react-router axios
```

| Paket | Zweck |
|-------|-------|
| **react-router** | URL-basierte Seitennavigation |
| **axios** | HTTP-Client für API-Aufrufe (Alternative zu `fetch`) |

### Schlüsselkonzepte

| Was | Wie | Warum |
|-----|-----|-------|
| shadcn/ui | `npx shadcn add` kopiert Komponenten in `src/components/ui/` | Fertige UI-Komponenten, die du anpassen kannst |
| `cn()` | Hilfsfunktion in `src/lib/utils.js` | Merged Tailwind-Klassen intelligent (Standard + Überschreibung) |

---

# Teil 2: Mock-Backend

Unser Backend existiert noch nicht. Mit json-server simulieren wir eine REST-API, und der Vite-Proxy sorgt dafür, dass der Code später ohne Änderungen mit dem echten Backend funktioniert.

---

## Schritt 5: Mock-API mit json-server

Unser Backend existiert noch nicht, aber wir wollen trotzdem echte HTTP-Aufrufe machen. **json-server** erstellt aus einer JSON-Datei automatisch eine REST-API.

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

| Endpoint | Beschreibung |
|----------|-------------|
| `GET /menu-items` | Alle Menüpunkte |
| `GET /menu-items/1` | Ein einzelner Menüpunkt |
| `GET /menu-items?restaurantId=1` | Menüpunkte eines Restaurants |

### Bilder

Lege 6 Pizza-Bilder in `public/images/` ab: `margherita.jpg`, `salami.jpg`, `funghi.jpg`, `quattro-formaggi.jpg`, `diavola.jpg`, `prosciutto.jpg`

> Dateien im `public/`-Ordner werden von Vite direkt unter `/` ausgeliefert. `public/images/margherita.jpg` ist also unter `http://localhost:5173/images/margherita.jpg` erreichbar.

### Was passiert hier?

Der **API-Layer** (den wir in Schritt 12 schreiben) ruft `/api/menu-items` auf. Er weiß **nicht**, ob dahinter json-server oder ein echtes Spring-Boot-Backend steckt. Wenn das echte Backend fertig ist, ändern wir nur eine Zeile in der Proxy-Konfiguration. Der gesamte restliche Code bleibt gleich.

### Schlüsselkonzepte

| Was | Wie | Warum |
|-----|-----|-------|
| json-server | `db.json` wird automatisch zur REST-API | Echte HTTP-Aufrufe ohne Backend |
| Mock-Daten | JSON-Datei im Projekt-Root | API-Layer merkt keinen Unterschied zum echten Backend |
| `public/` Ordner | Dateien werden von Vite unter `/` ausgeliefert | Bilder direkt per URL erreichbar |

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
                          |  (Vite Proxy)
                          v
json-server erhält:  http://localhost:3001/menu-items?restaurantId=1
```

Der `rewrite` entfernt das `/api`-Präfix, weil json-server die Endpoints ohne `/api` bereitstellt. Im Code schreiben wir immer `/api/...`. Das ist sauberer und entspricht dem echten Backend später.

### Schlüsselkonzepte

| Was | Wie | Warum |
|-----|-----|-------|
| Vite Proxy | `server.proxy` in `vite.config.js` | Kein CORS, gleiche URLs wie echtes Backend |
| URL-Rewrite | `/api/...` -> `localhost:3001/...` | Frontend nutzt `/api`-Prefix, json-server nicht |
| `changeOrigin` | Ändert den `Host`-Header im Request | Manche Backends prüfen den Host |

---

# Teil 3: Navigation & Layout

Jetzt bauen wir die Grundstruktur der App: React Router für die Seitennavigation, eine eigene Sidebar aus kleinen Bausteinen, die TopNav mit Toggle-Button und das App-Layout, das alles zusammenhält.

Die App Shell besteht aus vier Teilen, die wir Schritt für Schritt bauen:
1. **sidebar.jsx**: unsere eigenen Sidebar-Bausteine (kleine, wiederverwendbare Komponenten)
2. **AppSidebar**: setzt die Bausteine zu einer fertigen Seitenleiste zusammen
3. **TopNav**: obere Leiste mit Suchfeld, Toggle-Button und User-Avatar
4. **App**: verbindet alles und steuert, ob die Sidebar sichtbar ist

---

## Schritt 7: React Router einrichten

**React Router** ermöglicht Seitennavigation innerhalb der App, ohne die Seite neu zu laden. Die **URL ist die Source of Truth**. Jede Seite hat eine eigene URL.

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

### Was passiert hier?

| URL | Komponente | Beschreibung |
|-----|-----------|-------------|
| `/` | `<RestaurantPage />` | Startseite mit Speisekarte |
| `/menu-items/3` | `<MenuItemDetailPage />` | Detail eines Menüpunkts (`:id` = 3) |

1. `<App />` ist das **Layout** (Sidebar + TopNav), das immer sichtbar bleibt
2. `<Outlet />` in App.jsx rendert die jeweilige Seite je nach URL
3. `:id` ist ein **URL-Parameter**. In der Komponente liest man ihn mit `useParams()`

### Schlüsselkonzepte

| Was | Wie | Warum |
|-----|-----|-------|
| React Router | `createBrowserRouter` mit Route-Config | URL ist Source of Truth, kein Seiten-Reload |
| Nested Routes | `children` Array + `<Outlet />` in App.jsx | Layout bleibt, nur Seiteninhalt wechselt |
| URL-Parameter | `:id` im Route-Path, `useParams()` in Komponente | Dynamische Seiten (z.B. `/menu-items/3`) |

---

## Schritt 8: Sidebar-Bausteine erstellen

Statt die fertige (und sehr komplexe) shadcn-Sidebar zu verwenden, bauen wir unsere eigene: leichtgewichtig und verständlich. Jede Komponente ist nur ein gestyltes HTML-Element.

Erstelle `src/components/ui/sidebar.jsx`:

```jsx
import * as React from "react"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"

const SIDEBAR_WIDTH = "16rem"

function SidebarProvider({ className, style, children, ...props }) {
  return (
    <div
      data-slot="sidebar-wrapper"
      style={{ "--sidebar-width": SIDEBAR_WIDTH, ...style }}
      className={cn("flex min-h-svh w-full", className)}
      {...props}>
      {children}
    </div>
  )
}

function Sidebar({ className, children, ...props }) {
  return (
    <div className="hidden md:block text-sidebar-foreground" data-slot="sidebar">
      {/* Spacer: reserviert Platz für die fixierte Sidebar */}
      <div className="w-(--sidebar-width)" />
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-10 hidden h-svh w-(--sidebar-width) border-r md:flex",
          className
        )}
        {...props}>
        <div
          data-sidebar="sidebar"
          className="bg-sidebar flex h-full w-full flex-col">
          {children}
        </div>
      </div>
    </div>
  )
}

function SidebarHeader({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props} />
  )
}

function SidebarContent({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn("flex min-h-0 flex-1 flex-col gap-2 overflow-auto", className)}
      {...props} />
  )
}

function SidebarGroup({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-group"
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...props} />
  )
}

function SidebarGroupLabel({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-group-label"
      className={cn(
        "text-sidebar-foreground/70 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium",
        className
      )}
      {...props} />
  )
}

function SidebarGroupContent({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-group-content"
      className={cn("w-full text-sm", className)}
      {...props} />
  )
}

function SidebarMenu({ className, ...props }) {
  return (
    <ul
      data-slot="sidebar-menu"
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props} />
  )
}

function SidebarMenuItem({ className, ...props }) {
  return (
    <li
      data-slot="sidebar-menu-item"
      className={cn("group/menu-item relative", className)}
      {...props} />
  )
}

function SidebarMenuButton({
  asChild = false,
  className,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="sidebar-menu-button"
      className={cn(
        "flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        "[&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
        className
      )}
      {...props} />
  )
}

export {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
}
```

### Was passiert hier?

Das sind 10 Komponenten. Jede ist nur ein gestyltes HTML-Element. Hier eine Übersicht:

**Grundgerüst:**

| Komponente | HTML | Aufgabe |
|-----------|------|---------|
| `SidebarProvider` | `<div>` | Wrapper, setzt die CSS-Variable `--sidebar-width` |
| `Sidebar` | `<div>` | Fixierte Seitenleiste, auf Mobile ausgeblendet (`hidden md:block`) |

**Bereiche:**

| Komponente | HTML | Aufgabe |
|-----------|------|---------|
| `SidebarHeader` | `<div>` | Oberer Bereich (z.B. Logo) |
| `SidebarContent` | `<div>` | Scrollbarer Hauptbereich |

**Navigation:**

| Komponente | HTML | Aufgabe |
|-----------|------|---------|
| `SidebarGroup` | `<div>` | Gruppe von Menüpunkten |
| `SidebarGroupLabel` | `<div>` | Überschrift der Gruppe (z.B. "Restaurants") |
| `SidebarGroupContent` | `<div>` | Inhalt der Gruppe |
| `SidebarMenu` | `<ul>` | Liste (semantisches HTML) |
| `SidebarMenuItem` | `<li>` | Listenelement |
| `SidebarMenuButton` | `<button>` | Klickbarer Menüpunkt mit Hover-Effekt |

**`cn()` Funktion**: kommt aus `src/lib/utils.js` und führt CSS-Klassen zusammen. Damit kann man Standard-Klassen definieren und trotzdem von außen überschreiben:

```jsx
// cn() merged "flex p-2" (Standard) mit "p-4" (von außen) -> "flex p-4"
className={cn("flex p-2", className)}
```

**`...props` Spread**: leitet alle weiteren Props an das HTML-Element weiter. So kann man z.B. `onClick` oder `id` von außen setzen, ohne sie explizit zu definieren.

**`data-slot`**: markiert jede Komponente mit einem Namen (z.B. `data-slot="sidebar-header"`). Das dient zur Identifikation in CSS-Selektoren und Browser Dev-Tools.

**`asChild` Pattern**: `SidebarMenuButton` rendert normalerweise einen `<button>`. Mit `asChild` rendert es stattdessen das Kind-Element (z.B. einen `<Link>`). Das ermöglicht die Radix-Bibliothek mit `Slot.Root`:

```jsx
// Ohne asChild -> rendert <button>
<SidebarMenuButton>Klick mich</SidebarMenuButton>

// Mit asChild -> rendert <Link> mit den Styles des Buttons
<SidebarMenuButton asChild>
  <Link to="/">Startseite</Link>
</SidebarMenuButton>
```

**`hidden md:block`**: die Sidebar ist auf kleinen Bildschirmen (< 768px) versteckt und auf Desktop sichtbar. Auf Mobile zeigen wir stattdessen das Logo in der TopNav (Schritt 10).

### Schlüsselkonzepte

| Was | Wie | Warum |
|-----|-----|-------|
| CSS-Variable | `style={{ "--sidebar-width": SIDEBAR_WIDTH }}` | Breite zentral steuerbar, an einer Stelle änderbar |
| `cn()` Funktion | `className={cn("flex p-2", className)}` | Standard-Klassen definieren + von außen überschreibbar |
| `...props` Spread | `function Comp({ className, ...props })` | Alle HTML-Attribute durchreichen (onClick, id, etc.) |
| `data-slot` Attribut | `data-slot="sidebar-header"` | Markiert Komponenten fuer CSS-Selektoren und Dev-Tools |
| `asChild` Pattern | `Slot.Root` aus Radix rendert Kind-Element | `<Link>` bekommt Button-Styles (statt echtem `<button>`) |
| `hidden md:block` | Tailwind Responsive-Modifier | Sidebar nur auf Desktop (>= 768px) sichtbar |

---

## Schritt 9: AppSidebar zusammenbauen

Jetzt setzen wir die Bausteine aus Schritt 8 zusammen. `AppSidebar` ist unsere **App-spezifische** Sidebar. Sie enthält das Logo und die Restaurant-Navigation.

Erstelle `src/components/AppSidebar.jsx`:

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

### Was passiert hier?

Die Bausteine werden wie Puzzle-Teile zusammengesetzt:

```
<Sidebar>                          <- fixierte Seitenleiste
  <SidebarHeader>                  <- Logo-Bereich
    <Link> SpengerBite </Link>
  </SidebarHeader>
  <SidebarContent>                 <- scrollbarer Inhalt
    <SidebarGroup>                 <- Gruppe "Restaurants"
      <SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>              <- <ul> Liste
          <SidebarMenuItem>        <- <li> Eintrag
            <SidebarMenuButton>    <- klickbarer Link
```

> Jede Komponente kümmert sich um einen kleinen Teil: Layout, Spacing, Hover-Effekte. Zusammen ergeben sie eine vollständige Sidebar. Wenn man ein weiteres Restaurant hinzufügen will, fügt man einfach ein weiteres `<SidebarMenuItem>` hinzu.

### Schlüsselkonzepte

| Was | Wie | Warum |
|-----|-----|-------|
| Komponenten-Komposition | Bausteine aus Schritt 8 ineinander schachteln | Jede Komponente hat eine Aufgabe, zusammen ergeben sie das Ganze |
| `asChild` in Praxis | `<SidebarMenuButton asChild><Link to="/">` | Router-Link bekommt die Sidebar-Button-Styles |

---

## Schritt 10: TopNav erstellen

Die TopNav hat drei Bereiche:

1. **Links:** Toggle-Button (ein/ausblenden der Sidebar) + Logo auf Mobile
2. **Mitte:** Suchfeld (auf kleinen Bildschirmen ausgeblendet)
3. **Rechts:** User-Avatar mit Dropdown-Menü

Erstelle `src/components/TopNav.jsx`:

```jsx
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
      {/* Links: Toggle-Button + Logo (Mobile) */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
          <PanelLeft className="size-5" />
        </Button>
        <Link to="/" className="flex items-center gap-2 font-bold text-lg md:hidden">
          <UtensilsCrossed className="size-5" />
          SpengerBite
        </Link>
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

### Was passiert hier?

**Props als Callback**: `TopNav` erhält die Funktion `onToggleSidebar` als Prop vom Eltern-Element (`App`). Beim Klick auf den Button wird diese Funktion aufgerufen. So kann die TopNav die Sidebar steuern, ohne selbst den State zu kennen.

**`md:hidden`**: das SpengerBite-Logo in der TopNav ist nur auf **kleinen Bildschirmen** sichtbar. Auf dem Desktop zeigt die Sidebar das Logo. So haben Nutzer immer einen Home-Link.

### Schlüsselkonzepte

| Was | Wie | Warum |
|-----|-----|-------|
| Props als Callback | `onToggleSidebar` Funktion von `App` an `TopNav` übergeben | Kind-Komponente kann Eltern-State ändern |
| `md:hidden` | Logo nur auf kleinen Bildschirmen sichtbar | Desktop zeigt Sidebar-Logo, Mobile zeigt TopNav-Logo |
| shadcn Komponenten | `Button`, `Input`, `Avatar`, `DropdownMenu` | Fertige, barrierefreie UI-Elemente |

---

## Schritt 11: App.jsx: Alles zusammensetzen

Lösche `src/App.css` (wird nicht mehr benötigt) und ersetze `src/App.jsx`:

```jsx
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
```

### Was passiert hier?

**`useState(true)`**: steuert, ob die Sidebar sichtbar ist. `true` = sichtbar, `false` = versteckt. Das ist der gleiche Hook, den wir später für Daten-Loading verwenden (Schritt 14).

**Conditional Rendering**: `{sidebarOpen && <AppSidebar />}` rendert die Sidebar **nur**, wenn `sidebarOpen` true ist. Ist der Wert false, wird nichts angezeigt.

**Callback als Prop**: `onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}` übergibt eine Funktion an `TopNav`. Dort wird sie beim Klick auf den Toggle-Button aufgerufen. Das `!` dreht den Wert um: `true -> false -> true -> ...`

```
<SidebarProvider>                  <- Wrapper mit CSS-Variable
  {sidebarOpen && <AppSidebar />}  <- Sidebar (ein/ausblendbar)
  <div>
    <TopNav />                     <- Obere Leiste mit Toggle-Button
    <main>
      <Outlet />                   <- HIER wird die aktuelle Seite eingesetzt
    </main>                            (RestaurantPage oder MenuItemDetailPage)
  </div>
</SidebarProvider>
```

### Schlüsselkonzepte

| Was | Wie | Warum |
|-----|-----|-------|
| `useState` | `const [sidebarOpen, setSidebarOpen] = useState(true)` | Sidebar-Sichtbarkeit im State speichern |
| Conditional Rendering | `{sidebarOpen && <AppSidebar />}` | Sidebar nur rendern wenn `sidebarOpen === true` |
| Callback als Prop | `onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}` | TopNav kann den Sidebar-State umschalten |
| `<Outlet />` | React Router rendert hier die aktuelle Seite | Je nach URL: RestaurantPage oder MenuItemDetailPage |

---

# Teil 4: Features bauen

Mit dem Layout steht das Gerüst. Jetzt füllen wir es mit Inhalten: ein API-Layer für HTTP-Aufrufe, wiederverwendbare Komponenten und die erste Seite.

---

## Schritt 12: API-Layer

Der API-Layer kapselt alle HTTP-Aufrufe an einem Ort. Die Komponenten wissen nicht, **woher** die Daten kommen. Sie rufen eine Funktion auf und bekommen Daten zurück.

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

### Was passiert hier?

**Axios vs. Fetch:**

| | **fetch** (eingebaut) | **axios** (Library) |
|---|---|---|
| JSON parsen | Manuell: `res.json()` | Automatisch: `{ data }` |
| Error Handling | Nur Netzwerk-Fehler werfen | Auch HTTP-Fehler (4xx, 5xx) werfen |
| Query-Parameter | Manuell in URL | `params: { key: value }` |
| Base-URL | Jedes Mal schreiben | Einmal konfigurieren |

> Beide Versionen stehen in der Datei. Die Fetch-Version ist auskommentiert, damit man den Unterschied sieht.

**Warum `/api` als Prefix?** Der Code ruft `/api/menu-items` auf. Der Vite-Proxy leitet das an json-server weiter (Schritt 6). Wenn später das echte Backend läuft, ändert man nur die Proxy-Konfiguration. **Der API-Layer selbst bleibt unverändert.**

### Schlüsselkonzepte

| Was | Wie | Warum |
|-----|-----|-------|
| API-Layer | Zentraler Ordner `src/api/` mit exportierten Funktionen | Alle HTTP-Aufrufe an einem Ort, leicht austauschbar |
| Axios Instance | `axios.create({ baseURL: "/api" })` | Base-URL einmal definieren, nicht in jedem Aufruf |
| Fetch vs. Axios | Auskommentierte Fetch-Version in derselben Datei | Studenten sehen den direkten Vergleich |

---

## Schritt 13: Wiederverwendbare Komponente

Eine **Komponente** in React ist wie ein Puzzle-Teil: einmal gebaut, überall wiederverwendbar. `MenuItemCard` zeigt eine einzelne Pizza-Karte. Sie wird auf der RestaurantPage für jeden Menüpunkt verwendet.

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

| Was | Wie | Warum |
|-----|-----|-------|
| Props | `{ item }`: Daten von außen erhalten | Komponente ist wiederverwendbar für jeden Menüpunkt |
| `<Link>` | Klick navigiert zu `/menu-items/3` | SPA-Navigation ohne Seiten-Reload |
| shadcn Card | `Card`, `CardHeader`, `CardTitle`, `CardContent` | Fertige Karten-Struktur mit konsistentem Design |
| Tailwind-Klassen | `h-56`, `object-cover`, `line-clamp-2` | Bildhöhe, Bild-Füllung, Text-Beschneidung |

---

## Schritt 14: Restaurant-Seite

Die Hauptseite lädt die Menüpunkte vom API-Layer und zeigt sie als responsives Grid an.

### src/pages/RestaurantPage.jsx

```jsx
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
```

### Was passiert hier?

**useState**: verwaltet Daten innerhalb einer Komponente:
```javascript
const [menuItems, setMenuItems] = useState([])   // Liste der Menüpunkte
const [loading, setLoading] = useState(true)      // Lade-Zustand
const [error, setError] = useState(null)          // Fehlermeldung
```

**useEffect**: führt Code aus, wenn die Komponente geladen wird:
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
grid-cols-1              -> Mobile: 1 Spalte
md:grid-cols-2           -> Tablet (>=768px): 2 Spalten
xl:grid-cols-3           -> Desktop (>=1280px): 3 Spalten
```

### Schlüsselkonzepte

| Was | Wie | Warum |
|-----|-----|-------|
| `useState` | 3 State-Variablen: `menuItems`, `loading`, `error` | Daten, Lade-Zustand und Fehler getrennt verwalten |
| `useEffect` | Callback + leeres Array `[]` | API-Aufruf nur beim ersten Rendern ausführen |
| Promise-Kette | `.then(setMenuItems).catch(...).finally(...)` | Daten speichern, Fehler abfangen, Loading beenden |
| Responsives Grid | `grid-cols-1 md:grid-cols-2 xl:grid-cols-3` | 1/2/3 Spalten je nach Bildschirmgröße |

---

# Teil 5: Abschluss

Zeit zum Testen! Wir starten die App, prüfen alle Funktionen und dann bist du dran: zwei Aufgaben warten auf dich.

---

## Schritt 15: Starten & Testen

Du brauchst **zwei Terminals**:

**Terminal 1: Mock-API starten:**
```bash
npm run mock-api
```

**Terminal 2: Frontend starten:**
```bash
npm run dev
```

Öffne http://localhost:5173/ im Browser. Du solltest sehen:

1. Sidebar links mit "SpengerBite"-Logo und "Spenger Pizza"
2. Suchfeld oben, User-Avatar rechts
3. Toggle-Button (Panel-Icon) in der TopNav, der die Sidebar ein-/ausblendet
4. 6 Pizza-Karten im responsiven Grid
5. Auf Mobile (Fenster schmal ziehen): Sidebar verschwindet, SpengerBite-Logo erscheint in der TopNav

Klicke auf eine Pizza-Karte -> du kommst zu `/menu-items/1` -> dort steht "TODO: Implement this page!"

### Schlüsselkonzepte

| Was | Wie | Warum |
|-----|-----|-------|
| Zwei Dev-Server | Terminal 1: `npm run mock-api`, Terminal 2: `npm run dev` | Frontend und Mock-Backend müssen parallel laufen |
| Responsive Testen | Browserfenster schmal ziehen | Sidebar verschwindet, Logo erscheint in TopNav |

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
1. Schau dir `getMenuItems` als Vorlage an
2. Der Endpoint ist `GET /api/menu-items/:id`
3. Axios gibt die Daten in `{ data }` zurück

### Teil 2: Detail-Seite implementieren

Öffne `src/pages/MenuItemDetailPage.jsx` und ersetze den TODO-Bereich:

**Was du brauchst:**
1. **`useParams()`**: liest `:id` aus der URL (`/menu-items/3` -> `id = "3"`)
2. **`useState`**: für `menuItem`, `loading`, `error`
3. **`useEffect`**: ruft `getMenuItemById(id)` auf, wenn die Seite geladen wird
4. **shadcn Card**: zeigt Name, Preis und Beschreibung an

**Gewünschtes Ergebnis:**
1. URL `/menu-items/1` zeigt: "Margherita", "8.90", "Classic tomato sauce, mozzarella, fresh basil"
2. Ein "Back to menu"-Button navigiert zurück zur Startseite
3. Loading- und Error-States werden behandelt

**Tipp:** Die Imports stehen bereits in der Datei. Du musst nur die Logik innerhalb der Funktion schreiben.

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
