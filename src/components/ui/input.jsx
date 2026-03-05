// shadcn Input: https://ui.shadcn.com/docs/components/input
// cn() merged Standard-Klassen mit className von aussen. data-slot dient zur Identifikation in Dev-Tools.
import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "placeholder:text-muted-foreground border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props} />
  )
}

export { Input }
