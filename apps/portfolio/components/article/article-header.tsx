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
  /** Eyebrow label, e.g. "Project" or "Writing". */
  label: string
  meta: ArticleMeta
  readingTime: number
  /** Optional trailing node in the meta row (e.g. a "Visit live" link). */
  action?: ReactNode
}

function ArticleHeader({ label, meta, readingTime, action }: ArticleHeaderProps) {
  return (
    <div className="mx-auto w-full max-w-[1440px]">
      <div className="max-w-4xl px-6 pt-6 pb-12">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          {meta.title}
        </h1>
        {meta.description && (
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            {meta.description}
          </p>
        )}

        <div className="mt-6 flex items-center gap-3">
          {meta.authorImage && (
            <span className="relative size-9 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
              <Image
                src={meta.authorImage}
                alt={meta.author ?? "Author"}
                fill
                sizes="36px"
                className="object-cover"
              />
            </span>
          )}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            {meta.author && (
              <>
                <span>{meta.author}</span>
                <span aria-hidden>·</span>
              </>
            )}
            <time dateTime={meta.date}>
              {dateFormatter.format(new Date(meta.date))}
            </time>
            <span aria-hidden>·</span>
            <span>{readingTime} min read</span>
          </div>
        </div>

        {((meta.tags && meta.tags.length > 0) || action) && (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {meta.tags?.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
            {action}
          </div>
        )}
      </div>
    </div>
  )
}

export { ArticleHeader }
