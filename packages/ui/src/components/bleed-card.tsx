import * as React from "react"

import { Crosshair } from "@workspace/ui/components/crosshair"
import { cn } from "@workspace/ui/lib/utils"

/**
 * A full-bleed "blueprint" card: a rounded surface anchored to a centered guide
 * column that spills a fixed amount past it on every side. Behind the surface,
 * vertical rails (the column edges) and two full-bleed horizontal rules form a
 * rectangle the card breaks out of; crosshairs mark the four intersections, and
 * the guide lines continue *across* the card in a light, theme-inverting tone so
 * they stay visible on the surface.
 *
 * Everything is driven by two CSS variables so the geometry is fully dynamic:
 *   --frame-w : the guide column width (the rails sit at its edges)
 *   --bleed   : how far the card spills past the rails — and the inset of the
 *               guide-line rectangle, so crosshairs always land on the rails.
 *
 * The card is anchored to the column, not the viewport: it stays glued to the
 * rails at every width, and the section's `overflow-hidden` simply trims the
 * bleed once the viewport runs out of room — no reflow, no horizontal scrollbar.
 *
 * Pass the card's content as `children`. The default surface is a neutral gray
 * that flips with the theme (dark gray on a light page, light gray on a dark
 * one); content should use the inverse tokens (`text-background`, etc.). Padding
 * must clear `--bleed` so content sits inside the guide rectangle — override the
 * surface (incl. padding, radius, colors) via `surfaceClassName`.
 */
type BleedCardProps = React.ComponentProps<"section"> & {
  /** Guide column width in px (the rails sit at its edges). Default 1440. */
  frameWidth?: number
  /** How far the card spills past each rail in px; also the guide-line inset
   *  (so crosshairs land on the rails). Default 64. */
  bleed?: number
  /** Classes for the card surface itself (background, radius, padding, text). */
  surfaceClassName?: string
}

function BleedCard({
  frameWidth = 1440,
  bleed = 64,
  surfaceClassName,
  className,
  style,
  children,
  ...props
}: BleedCardProps) {
  const vars = {
    "--frame-w": `${frameWidth}px`,
    "--bleed": `${bleed}px`,
    ...style,
  } as React.CSSProperties

  return (
    <section
      data-slot="bleed-card"
      style={vars}
      className={cn("relative isolate overflow-hidden", className)}
      {...props}
    >
      {/* Vertical rails at the guide column, centered + behind the card. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 mx-auto w-full max-w-[var(--frame-w)] border-x border-border"
      />

      {/* The guide column the card is anchored to. */}
      <div className="relative z-10 mx-auto w-full max-w-[var(--frame-w)]">
        {/* Tight box == the card's box; holds the full-bleed horizontal rules as
            siblings so the card's overflow-hidden can't clip them. */}
        <div className="relative">
          {/* Full-bleed horizontal rules behind the card, `--bleed` from its top
              and bottom — the card passes straight through them. */}
          <div
            aria-hidden
            style={{ top: "var(--bleed)" }}
            className="pointer-events-none absolute left-1/2 z-0 w-screen -translate-x-1/2 border-t border-border"
          />
          <div
            aria-hidden
            style={{ bottom: "var(--bleed)" }}
            className="pointer-events-none absolute left-1/2 z-0 w-screen -translate-x-1/2 border-t border-border"
          />

          {/* The card — the guide column widened `--bleed` past each rail. */}
          <div
            style={{
              marginInline: "calc(var(--bleed) * -1)",
              width: "calc(100% + var(--bleed) * 2)",
            }}
            className={cn(
              "relative z-10 overflow-hidden rounded-3xl bg-neutral-800 px-20 py-24 text-background lg:px-24 dark:bg-neutral-200",
              surfaceClassName
            )}
          >
            {/* Guide lines + crosshairs in a light inverse tone, at the `--bleed`
                inset: the rails run the card's height, the rules its width, and
                the crosshairs sit on the four intersections — at every width. */}
            <div className="pointer-events-none absolute inset-0 z-30">
              <span
                style={{ left: "var(--bleed)" }}
                className="absolute inset-y-0 w-px bg-background/15"
              />
              <span
                style={{ right: "var(--bleed)" }}
                className="absolute inset-y-0 w-px bg-background/15"
              />
              <span
                style={{ top: "var(--bleed)" }}
                className="absolute inset-x-0 h-px bg-background/15"
              />
              <span
                style={{ bottom: "var(--bleed)" }}
                className="absolute inset-x-0 h-px bg-background/15"
              />

              <Crosshair
                position="top-left"
                style={{ top: "var(--bleed)", left: "var(--bleed)" }}
                className="text-background/30"
              />
              <Crosshair
                position="top-right"
                style={{ top: "var(--bleed)", right: "var(--bleed)" }}
                className="text-background/30"
              />
              <Crosshair
                position="bottom-left"
                style={{ bottom: "var(--bleed)", left: "var(--bleed)" }}
                className="text-background/30"
              />
              <Crosshair
                position="bottom-right"
                style={{ bottom: "var(--bleed)", right: "var(--bleed)" }}
                className="text-background/30"
              />
            </div>

            {children}
          </div>
        </div>
      </div>
    </section>
  )
}

export { BleedCard }
