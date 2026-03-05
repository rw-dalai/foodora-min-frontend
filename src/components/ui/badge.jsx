// shadcn Badge: https://ui.shadcn.com/docs/components/badge
// cn() merged Standard-Klassen mit className von aussen. data-slot dient zur Identifikation in Dev-Tools.
import * as React from "react"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"

const base =
  "inline-flex items-center justify-center rounded-full border border-transparent px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-[color,box-shadow] overflow-hidden"

const variants = {
  default: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  destructive: "bg-destructive text-white",
  outline: "border-border text-foreground",
}

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(base, variants[variant], className)}
      {...props} />
  )
}

export { Badge }
