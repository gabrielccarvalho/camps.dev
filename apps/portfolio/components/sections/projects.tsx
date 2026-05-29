"use client"

import Link from "next/link"
import { ArrowUpRight } from "@phosphor-icons/react"

import { Badge } from "@workspace/ui/components/badge"
import { Crosshair } from "@workspace/ui/components/crosshair"
import { FrameDivider } from "@workspace/ui/components/frame"
import { cn } from "@workspace/ui/lib/utils"

// Placeholder project data — replace with real projects, screenshots, and links.
const projects = [
  {
    id: "project-one",
    title: "Project One",
    description:
      "A short blurb about what this project is, the problem it solves, and your role in shipping it.",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    href: "#",
  },
  {
    id: "project-two",
    title: "Project Two",
    description:
      "Another placeholder description. Swap this out with a real project summary and a link to the live site or repo.",
    tags: ["React", "Node", "Postgres"],
    href: "#",
  },
  {
    id: "project-three",
    title: "Project Three",
    description:
      "Describe the impact here — what changed, what you learned, and why it mattered to the people using it.",
    tags: ["Astro", "Cloudflare"],
    href: "#",
  },
  {
    id: "project-four",
    title: "Project Four",
    description:
      "One more placeholder so the sticky hand-off has enough rows to demonstrate the effect on screen.",
    tags: ["Expo", "React Native"],
    href: "#",
  },
]

function Projects() {
  return (
    <section id="projects">
      {/* Section header */}
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="max-w-2xl px-6 py-16">
          <p className="text-sm font-medium text-muted-foreground">Work</p>
          <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Latest projects
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            A few things I&apos;ve shipped recently.
          </p>
        </div>
      </div>

      {/* Full-bleed divider between the header and the projects */}
      <FrameDivider />

      {/* Project rows — aligned to the page rails; cells pad inward. */}
      <div className="relative mx-auto w-full max-w-[1440px]">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className={cn(
              "relative grid lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]",
              index > 0 && "border-t border-border"
            )}
          >
            {/* column-width divider crosshairs at the rails (between projects only) */}
            {index > 0 && (
              <>
                <Crosshair position="top-left" />
                <Crosshair position="top-right" />
              </>
            )}

            {/* Left: sticky project name — pins while its row scrolls, then hands off */}
            <div className="self-start px-6 py-10 lg:sticky lg:top-24 lg:pr-12 lg:pl-6">
              <p className="font-mono text-sm text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-1 font-heading text-2xl font-semibold tracking-tight">
                {project.title}
              </h3>
            </div>

            {/* Right: project content */}
            <div className="relative flex flex-col gap-5 px-6 py-10 lg:border-l lg:border-border lg:py-16 lg:pr-6 lg:pl-12">
              {/* crosshair where the inner rail crosses this divider */}
              <Crosshair position="top-left" className="hidden lg:block" />

              {/* Replace with <Image /> once real screenshots exist. */}
              <div className="aspect-[16/10] w-full overflow-hidden rounded-xl border border-border bg-muted" />

              <div className="flex items-start justify-between gap-4">
                <p className="text-pretty text-muted-foreground">
                  {project.description}
                </p>
                <Link
                  href={project.href}
                  className="group inline-flex shrink-0 items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Visit
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>

              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export { Projects }
