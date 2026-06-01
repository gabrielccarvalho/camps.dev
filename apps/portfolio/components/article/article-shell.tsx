import type { ReactNode } from "react"
import Image from "next/image"

import { Crosshair } from "@workspace/ui/components/crosshair"
import { Frame, FrameDivider } from "@workspace/ui/components/frame"

import type { Article } from "@/lib/content"

import { ArticleBody } from "./article-body"
import { ArticleHeader } from "./article-header"
import { ArticleToc } from "./article-toc"

type ArticleShellProps = {
  article: Article
  /** Optional trailing node in the header meta row (e.g. a "Visit live" link). */
  headerAction?: ReactNode
}

/**
 * Page-level layout for an article: header, then a rail-aligned two-column body
 * (prose | sticky chapters TOC), all inside the blueprint frame. Mirrors the
 * projects section's sticky aside|content split, with crosshairs on every
 * rail × divider intersection.
 */
function ArticleShell({ article, headerAction }: ArticleShellProps) {
  return (
    <Frame className="[--frame-width:1440px]">
      <FrameDivider />

      <ArticleHeader
        meta={article.meta}
        readingTime={article.readingTime}
        action={headerAction}
      />

      <FrameDivider />

      <div className="relative mx-auto grid w-full max-w-[1440px] lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)]">
        {/* Prose column (left), separated from the chapters by the inner rail.
            `min-w-0` lets the column shrink below its content's intrinsic width so
            long code lines scroll inside their block instead of blowing out the
            mobile layout. */}
        <div className="relative min-w-0 px-6 py-10 lg:border-r lg:border-border lg:py-16 lg:pr-12">
          {/* crosshair where the inner rail crosses the top divider */}
          <Crosshair position="top-right" className="hidden lg:block" />

          {/* Cover banner — the first thing in the post body, aligned to the
              prose column with the chapters TOC beside it. */}
          {article.meta.cover && (
            <div className="mb-10 relative aspect-[16/7] max-h-96 w-full overflow-hidden rounded-xl border border-border bg-muted">
              <Image
                src={article.meta.cover}
                alt={`${article.meta.title} cover`}
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
                priority
              />
            </div>
          )}

          <ArticleBody content={article.content} />
        </div>

        {/* Chapters aside (right) — a muted full-height sidebar whose inner panel
            pins from top-24 and rides the whole article body, handing off at the
            end (same sticky pattern as Projects). */}
        <aside className="hidden self-stretch lg:block lg:bg-muted/50">
          <div className="px-6 py-16 lg:sticky lg:top-24 lg:pl-12">
            {article.meta.author && (
              <div className="mb-8">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Written by
                </p>
                <div className="mt-3 flex items-center gap-3">
                  {article.meta.authorImage && (
                    <span className="relative size-9 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                      <Image
                        src={article.meta.authorImage}
                        alt={article.meta.author}
                        fill
                        sizes="36px"
                        className="object-cover"
                      />
                    </span>
                  )}
                  <span className="text-sm font-medium text-foreground">
                    {article.meta.author}
                  </span>
                </div>
              </div>
            )}

            <ArticleToc items={article.toc} />
          </div>
        </aside>
      </div>

      <FrameDivider />
    </Frame>
  )
}

export { ArticleShell }
