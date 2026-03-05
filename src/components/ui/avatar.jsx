// shadcn Avatar: https://ui.shadcn.com/docs/components/avatar
// cn() merged Standard-Klassen mit className von aussen. data-slot dient zur Identifikation in Dev-Tools.
import * as React from "react"
import { Avatar as AvatarPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

function Avatar({ className, ...props }) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn("relative flex size-8 shrink-0 overflow-hidden rounded-full", className)}
      {...props} />
  )
}

function AvatarFallback({ className, ...props }) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted text-muted-foreground flex size-full items-center justify-center rounded-full text-sm",
        className
      )}
      {...props} />
  )
}

export { Avatar, AvatarFallback }
