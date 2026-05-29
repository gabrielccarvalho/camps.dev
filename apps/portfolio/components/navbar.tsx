import Link from "next/link"

import { Container } from "@/components/container"

const links = [
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
]

function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <Container className="relative flex h-16 items-center justify-between">
        <Link
          href="/"
          className="font-heading text-lg font-bold tracking-tight"
        >
          camps.dev
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="#contact"
          className="text-sm font-medium underline decoration-1 underline-offset-4 transition-colors hover:text-primary"
        >
          Get in contact
        </Link>
      </Container>
    </header>
  )
}

export { Navbar }
