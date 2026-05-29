import * as React from "react"

import { cn } from "@workspace/ui/lib/utils"

const crosshairPositions = {
  "top-left": "top-0 left-0 -translate-x-1/2 -translate-y-1/2",
  "top-right": "top-0 right-0 translate-x-1/2 -translate-y-1/2",
  "bottom-left": "bottom-0 left-0 -translate-x-1/2 translate-y-1/2",
  "bottom-right": "bottom-0 right-0 translate-x-1/2 translate-y-1/2",
} as const

type CrosshairProps = React.ComponentProps<"span"> & {
  /** Which corner of the positioned parent to center the mark on. */
  position?: keyof typeof crosshairPositions
  /** Size of the mark in pixels. */
  size?: number
}

function Crosshair({
  className,
  position = "top-left",
  size = 15,
  style,
  ...props
}: CrosshairProps) {
  return (
    <span
      aria-hidden
      data-slot="crosshair"
      style={{ width: size, height: size, ...style }}
      className={cn(
        "pointer-events-none absolute z-20 block text-muted-foreground/40",
        crosshairPositions[position],
        className
      )}
      {...props}
    >
      <span className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-current" />
      <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-current" />
    </span>
  )
}

export { Crosshair }
