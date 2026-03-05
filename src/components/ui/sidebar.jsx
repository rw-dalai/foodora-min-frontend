// shadcn Sidebar: https://ui.shadcn.com/docs/components/sidebar
// cn() merged Standard-Klassen mit className von aussen. data-slot dient zur Identifikation in Dev-Tools.
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
      {/* Spacer that reserves horizontal space for the fixed sidebar */}
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
