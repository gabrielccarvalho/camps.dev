"use client"

import { EnvelopeSimple } from "@phosphor-icons/react"

import { BleedCard } from "@workspace/ui/components/bleed-card"
import { cn } from "@workspace/ui/lib/utils"

// The newsletter section is just content handed to the reusable BleedCard shell
// (which owns the blueprint framing, rails, crosshairs, and theme-inverting
// surface). Content uses the inverse tokens — `text-background` for primary
// text, `text-background/<n>` for muted, `border-background/<n>` for hairlines —
// so it tracks the card's light/dark flip.
function Newsletter() {
  return (
    <BleedCard
      bleed={48}
      className="py-20 sm:py-28"
      surfaceClassName="dark:bg-neutral-400"
    >
      {/* Faint oversized glyph watermark, echoing the reference's depth. It
          positions against the card edges and is clipped by the card. */}
      <EnvelopeSimple
        aria-hidden
        weight="duotone"
        className="pointer-events-none absolute -right-8 -bottom-12 size-72 text-background/[0.04] sm:size-96"
      />

      <div className="relative z-20 max-w-xl">
        <h2 className="font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          Subscribe to my newsletter
        </h2>
        <p className="mt-6 text-pretty text-background/60">
          Updates from the world of tech, insights I pick up along the way, and
          new technologies worth trying — straight to your inbox.
        </p>

        <form
          className="mt-12"
          onSubmit={(event) => {
            event.preventDefault()
            // TODO: wire to a newsletter provider (Buttondown, ConvertKit,
            // Resend Audiences, …). UI-only for now.
          }}
        >
          <div className="flex w-full max-w-md items-center gap-2 rounded-full border border-background/15 bg-background/[0.04] p-1.5 pl-5">
            <input
              type="email"
              required
              name="email"
              autoComplete="email"
              placeholder="bobloblaw@gmail.com"
              aria-label="Email address"
              className={cn(
                "min-w-0 flex-1 bg-transparent text-sm text-background",
                "placeholder:text-background/40 focus:outline-none"
              )}
            />
            <button
              type="submit"
              className={cn(
                "shrink-0 rounded-full bg-background px-4 py-2 text-sm font-semibold text-foreground",
                "transition-opacity hover:opacity-90 focus-visible:outline-none",
                "focus-visible:ring-2 focus-visible:ring-background/50"
              )}
            >
              Subscribe
            </button>
          </div>
        </form>

        <p className="mt-12 text-sm text-background/60">
          <span className="font-semibold text-background">NO SPAM.</span> I
          never send spam. You can unsubscribe at any time!
        </p>
      </div>
    </BleedCard>
  )
}

export { Newsletter }
