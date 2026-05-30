import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr"

import { Crosshair } from "@workspace/ui/components/crosshair"
import { cn } from "@workspace/ui/lib/utils"

import type { ArticleMeta } from "@/lib/content"

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
})

/**
 * The blog card lattice — a rail-aligned 3-column grid shared by the homepage
 * "From the blog" section and the /blog index. Borders between cells draw the
 * inner rails and row dividers; the outer rails and top/bottom lines come from
 * the enclosing <Frame> / <FrameDivider>s. Crosshairs land on every
 * intersection. Works for any number of posts.
 */
function BlogGrid({ posts }: { posts: ArticleMeta[] }) {
  return (
    <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 lg:grid-cols-3">
      {posts.map((post, index) => {
        const col = index % 3
        const row = Math.floor(index / 3)

        return (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className={cn(
              "group relative flex flex-col px-6 py-10 transition-colors hover:bg-muted/40",
              // Mobile hairline between stacked cards; at lg it's the row divider.
              index > 0 && "border-t border-border",
              index > 0 && row === 0 && "lg:border-t-0",
              // Inner vertical rails between columns (lg only).
              col > 0 && "lg:border-l lg:border-border"
            )}
          >
            {index > 0 && <Crosshair position="top-left" />}
            {col === 2 ? (
              <Crosshair position="top-right" />
            ) : (
              index > 0 && (
                <Crosshair position="top-right" className="lg:hidden" />
              )
            )}
            {row > 0 && col > 0 && (
              <Crosshair position="bottom-left" className="hidden lg:block" />
            )}

            {/* Cover image when present; otherwise a muted placeholder. */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-border bg-muted">
              {post.cover && (
                <Image
                  src={post.cover}
                  alt={`${post.title} cover`}
                  fill
                  sizes="(min-width: 1024px) 30vw, 100vw"
                  className="object-cover"
                />
              )}
            </div>

            <p className="mt-5 font-mono text-xs text-muted-foreground">
              {dateFormatter.format(new Date(post.date))}
            </p>
            <h3 className="mt-2 font-heading text-lg font-semibold tracking-tight text-balance">
              {post.title}
            </h3>
            <p className="mt-2 text-pretty text-sm text-muted-foreground">
              {post.description}
            </p>

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
  )
}

export { BlogGrid }
