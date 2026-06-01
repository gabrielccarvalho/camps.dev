import type { ReactNode } from "react"
import Image from "next/image"

import { Badge } from "@workspace/ui/components/badge"

import type { ArticleMeta } from "@/lib/content"

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
})

type ArticleHeaderProps = {
  meta: ArticleMeta
  readingTime: number
  /** Optional trailing node in the meta row (e.g. a "Visit live" link). */
  action?: ReactNode
}

function ArticleHeader({ meta, readingTime, action }: ArticleHeaderProps) {
  // A single category badge — the first tag — sits with the date above the title.
  const category = meta.tags?.[0]

  return (
    <div className="relative mx-auto w-full max-w-[1440px] overflow-hidden">
      {/* Faint squared-tile grid behind the header, fading toward the edges
          (same technique as the hero). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative max-w-4xl px-6 pt-16 pb-12">
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          {category && (
            <Badge
              variant="outline"
              className="h-auto rounded-lg bg-background px-3.5 py-1.5 text-sm font-medium text-foreground shadow-sm"
            >
              {category}
            </Badge>
          )}
          <div className="flex items-center gap-2.5">
            <time dateTime={meta.date}>
              {dateFormatter.format(new Date(meta.date))}
            </time>
            <span
              aria-hidden
              className="size-1 rounded-full bg-muted-foreground/50"
            />
            <span>{readingTime} min read</span>
          </div>
          {action && <div className="ms-auto">{action}</div>}
        </div>

        <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          {meta.title}
        </h1>
        {meta.description && (
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            {meta.description}
          </p>
        )}

        {/* Mobile byline — the desktop layout shows the author in the chapters
            sidebar instead, which is hidden below `lg`. */}
        {meta.author && (
          <div className="mt-6 flex items-center gap-3 lg:hidden">
            {meta.authorImage && (
              <span className="relative size-9 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                <Image
                  src={meta.authorImage}
                  alt={meta.author}
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </span>
            )}
            <span className="text-sm font-medium text-foreground">
              {meta.author}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export { ArticleHeader }
