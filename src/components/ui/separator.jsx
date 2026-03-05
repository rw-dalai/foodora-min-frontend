// shadcn Separator: https://ui.shadcn.com/docs/components/separator
// cn() merged Standard-Klassen mit className von aussen. data-slot dient zur Identifikation in Dev-Tools.
import * as React from "react"
import { Separator as SeparatorPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

function Separator({ className, orientation = "horizontal", decorative = true, ...props }) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn("bg-border shrink-0 h-px w-full", className)}
      {...props} />
  )
}

export { Separator }
