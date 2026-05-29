import * as React from "react"

import { cn } from "@workspace/ui/lib/utils"
import { Crosshair } from "@workspace/ui/components/crosshair"

/**
 * A full-bleed framed region: horizontal dividers run edge-to-edge of the
 * viewport, while vertical guide rails are drawn at the content column (set via
 * the `--frame-width` CSS variable, default 80rem). Place <FrameDivider /> between
 * sections; their crosshairs land where the rails cross each full-width line.
 */
function Frame({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="frame"
      className={cn("relative w-full", className)}
      {...props}
    >
      {/* Continuous vertical rails at the content-column edges. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mx-auto w-full max-w-[var(--frame-width,80rem)] border-x border-border"
      />
      {children}
    </div>
  )
}

/** A full-width horizontal rule with crosshairs where the rails cross it. */
function FrameDivider({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="frame-divider"
      className={cn("relative border-t border-border", className)}
      {...props}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto w-full max-w-[var(--frame-width,80rem)]">
        <Crosshair position="top-left" />
        <Crosshair position="top-right" />
      </div>
    </div>
  )
}

export { Frame, FrameDivider }
