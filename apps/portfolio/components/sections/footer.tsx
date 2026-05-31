import Link from "next/link"
import {
  ArrowUpRight,
  GithubLogo,
  LinkedinLogo,
  XLogo,
} from "@phosphor-icons/react/dist/ssr"

import { buttonVariants } from "@workspace/ui/components/button"
import { Crosshair } from "@workspace/ui/components/crosshair"
import { FrameDivider } from "@workspace/ui/components/frame"
import { cn } from "@workspace/ui/lib/utils"

import { Container } from "@/components/container"
import { getAllArticles } from "@/lib/content"

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/gabrielcamposdecarvalho/",
    icon: LinkedinLogo,
  },
  {
    label: "GitHub",
    href: "https://github.com/gabrielccarvalho",
    icon: GithubLogo,
  },
  { label: "X", href: "https://x.com/gabrielcdev", icon: XLogo },
]

function Footer() {
  // The 5 most recent blog posts, newest first (getAllArticles sorts by date).
  const blogLinks = getAllArticles("blog")
    .slice(0, 5)
    .map((article) => ({
      label: article.title,
      href: `/blog/${article.slug}`,
    }))

  // The 5 most recent project deep-dives, newest first, linking to their
  // internal article pages (same routing as the Projects section CTA).
  const projectLinks = getAllArticles("projects")
    .slice(0, 5)
    .map((article) => ({
      label: article.title,
      href: `/projects/${article.slug}`,
    }))

  return (
    <footer>
      {/* Part 1 — Contact band. Reuses the hero's layered glow (indigo→violet +
          teal) so the page bookends with the same light. `id="contact"` is the
          target of the navbar's "Get in contact" / #contact links. */}
      <section id="contact" className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 h-[40rem] w-[40rem] -translate-x-[70%] -translate-y-1/2 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 opacity-20 blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 h-[40rem] w-[40rem] -translate-x-[30%] -translate-y-1/2 rounded-full bg-teal-400 opacity-20 blur-[120px]" />
        </div>

        <Container className="relative z-10 flex flex-col items-center py-28 text-center sm:py-36">
          <h2 className="max-w-2xl font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            Let&apos;s build something great together.
          </h2>
          <p className="mt-5 max-w-lg text-pretty text-muted-foreground">
            Have a project in mind, or just want to say hi? My inbox is always
            open — I&apos;d love to hear what you&apos;re working on.
          </p>
          <a
            href="mailto:gabrielccarvalhopro@gmail.com"
            className={cn(buttonVariants({ size: "lg" }), "group mt-10")}
          >
            Get in touch
            <ArrowUpRight
              aria-hidden
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </Container>
      </section>

      {/* Full-bleed line between the contact band and the footer proper. */}
      <FrameDivider />

      {/* Part 2 — Footer proper. Aligned to the page rails (max-w column, no
          x-padding) so the bottom divider reaches rail-to-rail and its
          crosshairs land on the rails; content pads inward instead. */}
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="grid grid-cols-1 gap-12 px-6 py-12 lg:min-h-[34rem] lg:grid-cols-[1.5fr_2fr]">
          {/* Brand block — wordmark up top, socials + status pinned to the
              bottom of the column at lg (the column's min height opens a wide
              gap between them). */}
          <div className="flex flex-col">
            <Link
              href="/"
              className="font-heading text-xl font-bold tracking-tight"
            >
              camps.dev
            </Link>

            <div className="mt-16 flex flex-col gap-6 lg:mt-auto">
              <div className="flex items-center gap-3">
                {socialLinks.map(({ label, href, icon: Icon }) => (
                  <Link
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Icon weight="fill" className="size-5" />
                  </Link>
                ))}
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/60" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                All systems operational
              </div>
            </div>
          </div>

          {/* Link columns. */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
            <FooterColumn title="Blog" links={blogLinks} />
            <FooterColumn title="Projects" links={projectLinks} />

            <div>
              <h3 className="text-sm font-semibold">Socials</h3>
              <ul className="mt-4 space-y-3">
                {socialLinks.map(({ label, href, icon: Icon }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Icon
                        aria-hidden
                        weight="fill"
                        className="size-4 text-muted-foreground transition-colors group-hover:text-foreground"
                      />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Column-width divider above the bottom bar: spans rail-to-rail so the
            crosshairs land on the page rails; the bar's content pads inward. */}
        <div className="relative border-t border-border">
          <Crosshair position="top-left" />
          <Crosshair position="top-right" />
          <p className="px-6 py-8 text-sm text-muted-foreground">
            © 2026 Gabriel Carvalho. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

type FooterColumnProps = {
  title: string
  links: { label: string; href: string }[]
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              {...(link.href.startsWith("http")
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="text-sm text-pretty text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export { Footer }
