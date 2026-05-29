import Link from "next/link"
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr"

import { Crosshair } from "@workspace/ui/components/crosshair"
import { FrameDivider } from "@workspace/ui/components/frame"
import { cn } from "@workspace/ui/lib/utils"

// Placeholder posts — there is no blog wired up yet. Swap these for real entries
// (and point `href` at the post route) once writing exists.
const posts = [
  {
    id: "post-one",
    title: "Building a blueprint-frame layout in Tailwind v4",
    description:
      "How the rails, dividers, and crosshairs on this site come together with pure CSS — no JavaScript, no scroll-spy.",
    href: "#",
  },
  {
    id: "post-two",
    title: "Server Components, one year in",
    description:
      "Where the App Router shines, where it bites, and the mental model that finally made it click for me.",
    href: "#",
  },
  {
    id: "post-three",
    title: "Designing with OKLCH color tokens",
    description:
      "Why I moved every design token to OKLCH and how it makes light and dark themes feel balanced.",
    href: "#",
  },
  {
    id: "post-four",
    title: "A monorepo that stays out of your way",
    description:
      "The pnpm + Turborepo setup behind this site, and the small conventions that keep it pleasant.",
    href: "#",
  },
  {
    id: "post-five",
    title: "Animating with CSS, sparingly",
    description:
      "A look at the marquee and hover micro-interactions here, and why I reach for CSS before a library.",
    href: "#",
  },
  {
    id: "post-six",
    title: "Shipping a personal site, again",
    description:
      "Notes on starting over, cutting scope, and actually getting a portfolio out the door this time.",
    href: "#",
  },
]

function Blog() {
  return (
    <section id="blog">
      {/* Section header */}
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="max-w-2xl px-6 py-16">
          <p className="text-sm font-medium text-muted-foreground">Writing</p>
          <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            From the blog
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            Notes on building things for the web — design, code, and the bits in
            between.
          </p>
        </div>
      </div>

      {/* Full-bleed divider between the header and the grid */}
      <FrameDivider />

      {/* Card lattice — aligned to the page rails; cells pad inward.
          Borders between cells draw the inner rails and row divider; the outer
          rails come from the enclosing <Frame> and the top/bottom lines from the
          surrounding <FrameDivider />s. Crosshairs land on every intersection. */}
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 lg:grid-cols-3">
        {posts.map((post, index) => {
          const col = index % 3
          const row = Math.floor(index / 3)

          return (
            <Link
              key={post.id}
              href={post.href}
              className={cn(
                "group relative flex flex-col px-6 py-10 transition-colors hover:bg-muted/40",
                // Mobile: hairline between every stacked card. At lg this also
                // serves as the row divider — kept only for the second row.
                index > 0 && "border-t border-border",
                index > 0 && row === 0 && "lg:border-t-0",
                // Inner vertical rails between columns (lg only).
                col > 0 && "lg:border-l lg:border-border"
              )}
            >
              {/* Crosshairs at this cell's lattice intersections. The cell's
                  top-left works for both layouts: on mobile it sits on the outer
                  rail (full-width card), at lg on the inner rail / row line. */}
              {index > 0 && <Crosshair position="top-left" />}
              {/* Right-rail crosshair: only the last column needs it at lg; every
                  stacked card needs it on mobile. */}
              {col === 2 ? (
                <Crosshair position="top-right" />
              ) : (
                index > 0 && (
                  <Crosshair position="top-right" className="lg:hidden" />
                )
              )}
              {/* Inner-rail bottoms where they meet the closing divider (lg). */}
              {row > 0 && col > 0 && (
                <Crosshair position="bottom-left" className="hidden lg:block" />
              )}

              {/* Cover image placeholder — swap for <Image /> when posts exist. */}
              <div className="aspect-[16/10] w-full overflow-hidden rounded-lg border border-border bg-muted" />

              <h3 className="mt-5 font-heading text-lg font-semibold tracking-tight text-balance">
                {post.title}
              </h3>
              <p className="mt-2 text-pretty text-sm text-muted-foreground">
                {post.description}
              </p>

              {/* Footer pinned to the bottom; arrow nudges on card hover. */}
              <div className="mt-auto flex justify-end pt-6">
                <ArrowUpRight
                  aria-hidden
                  className="size-5 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground"
                />
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export { Blog }
