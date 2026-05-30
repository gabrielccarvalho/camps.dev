import Link from "next/link"

import { Crosshair } from "@workspace/ui/components/crosshair"
import { Frame } from "@workspace/ui/components/frame"

import { Container } from "@/components/container"
import { SmoothLink } from "@/components/smooth-link"
import { ThemeToggle } from "@/components/theme-toggle"

const links = [
  { label: "Projects", href: "/#projects" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/#contact" },
]

function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full overflow-x-clip border-b border-border bg-background/80 backdrop-blur-md">
      <Frame className="[--frame-width:1440px]">
        <Container className="relative flex h-16 items-center justify-between">
          <Link
            href="/"
            className="font-heading text-lg font-bold tracking-tight"
          >
            camps.dev
          </Link>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
            {links.map((link) => (
              <SmoothLink
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </SmoothLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle className="-ml-1" />
            <SmoothLink
              href="/#contact"
              className="text-sm font-medium underline decoration-1 underline-offset-4 transition-colors hover:text-primary"
            >
              Get in contact
            </SmoothLink>
          </div>
        </Container>

        {/* crosshairs where the rails meet the navbar's bottom border */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto w-full max-w-[var(--frame-width)]">
          <Crosshair position="bottom-left" />
          <Crosshair position="bottom-right" />
        </div>
      </Frame>
    </header>
  )
}

export { Navbar }
