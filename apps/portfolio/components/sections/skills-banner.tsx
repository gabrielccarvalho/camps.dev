import {
  siExpo,
  siNextdotjs,
  siReact,
  siShopify,
  siTypescript,
  type SimpleIcon,
} from "simple-icons"

import { Crosshair } from "@workspace/ui/components/crosshair"
import { cn } from "@workspace/ui/lib/utils"

import { Container } from "@/components/container"

// Tech Gabe works with. Reorder/add/remove freely — each entry is one tile.
// React Native reuses the React glyph (simple-icons has no separate mark).
const skills: { name: string; icon: SimpleIcon }[] = [
  { name: "Next.js", icon: siNextdotjs },
  { name: "React", icon: siReact },
  { name: "React Native", icon: siReact },
  { name: "Expo", icon: siExpo },
  { name: "Shopify", icon: siShopify },
  { name: "TypeScript", icon: siTypescript },
]

// Renders a simple-icons glyph in the current text color (no brand hex), keeping
// every mark monochrome and on-token — consistent with the logo ticker silhouettes.
function TechIcon({ icon, className }: { icon: SimpleIcon; className?: string }) {
  return (
    <svg
      role="img"
      aria-hidden
      viewBox="0 0 24 24"
      className={cn("size-7", className)}
    >
      <path d={icon.path} fill="currentColor" />
    </svg>
  )
}

function SkillsBanner() {
  return (
    <section className="relative isolate overflow-hidden py-12">
      {/* Light violet backdrop covering the whole section. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/15 via-violet-500/10 to-transparent"
      />

      {/* Heading — padded inward from the rails. */}
      <Container className="relative z-10">
        <h2 className="font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          What I&apos;m great with
        </h2>
      </Container>

      {/* Tech lattice — 3 cells per row (→ 2 → 1 as the viewport narrows),
          aligned to the page rails so each cell is ~1440/3 wide. Cells are
          transparent so the backdrop reads through. The wrapper draws the
          top/left edges; each cell its right/bottom. Crosshairs mark every
          grid intersection: top-left on all cells covers the top/left/interior
          crossings; the .ch-* marks add the right rail (last column) and bottom
          edge (last row), gated per breakpoint so nothing doubles up. */}
      <div className="relative z-10 mx-auto mt-8 grid w-full max-w-[1440px] grid-cols-1 border-t border-l border-border sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill) => (
          <div
            key={skill.name}
            className={cn(
              "group relative flex h-44 items-center justify-center gap-3 border-r border-b border-border px-2 transition-colors hover:bg-foreground/[0.03]",
              // right rail — only the last cell in each row
              "[&_.ch-r]:block",
              "sm:[&_.ch-r]:hidden sm:[&:nth-child(2n)_.ch-r]:block",
              "lg:[&_.ch-r]:hidden lg:[&:nth-child(3n)_.ch-r]:block",
              // bottom edge — only cells in the last row
              "[&:last-child_.ch-b]:block",
              "sm:[&:nth-last-child(-n+2)_.ch-b]:block",
              "lg:[&:nth-last-child(-n+3)_.ch-b]:block",
              // bottom-right corner — only the final cell
              "[&:last-child_.ch-c]:block"
            )}
          >
            <Crosshair position="top-left" />
            <Crosshair position="top-right" className="ch-r hidden" />
            <Crosshair position="bottom-left" className="ch-b hidden" />
            <Crosshair position="bottom-right" className="ch-c hidden" />

            <TechIcon
              icon={skill.icon}
              className="shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
            />
            <span className="font-medium text-foreground">{skill.name}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export { SkillsBanner }
