"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "@phosphor-icons/react"

import { Badge } from "@workspace/ui/components/badge"
import { Crosshair } from "@workspace/ui/components/crosshair"
import { FrameDivider } from "@workspace/ui/components/frame"
import { cn } from "@workspace/ui/lib/utils"

type Project = {
  id: string
  title: string
  description: string
  tags: string[]
  href: string
  image?: string
}

// Placeholder project data — replace with real projects, screenshots, and links.
const projects: Project[] = [
  {
    id: "zimo",
    title: "Zimo",
    description:
      "A personal assistant on WhatsApp that keeps track of all your finances, meetings, and schedule — right inside your chats.",
    tags: ["Next.js", "React", "AI"],
    href: "https://zimo.com.br/",
    image: "/projects/zimo.png",
  },
  {
    id: "adviso",
    title: "Adviso",
    description:
      "An AI-focused tool to analyze and improve your ad campaigns across social media — Facebook, Instagram, TikTok, Google Ads, and many more.",
    tags: ["Next.js", "React", "AI", "Node", "Postgres"],
    href: "https://adviso.com.br/",
    image: "/projects/adviso.png",
  },
  {
    id: "study-app",
    title: "Study App",
    description:
      "A platform to gamify your study sessions. Log hours and compete with your friends in a fun way.",
    tags: ["Next.js", "React", "AI", "Node", "Postgres"],
    href: "https://study.app.br/",
    image: "/projects/study-app.png",
  },
]

function Projects() {
  return (
    <section id="projects">
      {/* Section header */}
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="max-w-2xl px-6 py-16">
          <p className="text-sm font-medium text-muted-foreground">Projects</p>
          <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Latest work
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            A few things I&apos;m proud to have shipped recently.
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

              {/* Real screenshot when available; otherwise a muted placeholder. */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border bg-muted">
                {project.image && (
                  <Image
                    src={project.image}
                    alt={`${project.title} screenshot`}
                    fill
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className="object-cover"
                  />
                )}
              </div>

              <div className="flex items-start justify-between gap-4">
                <p className="text-pretty text-muted-foreground">
                  {project.description}
                </p>
                <Link
                  href={`/projects/${project.id}`}
                  className="group inline-flex shrink-0 items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Learn more
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
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
