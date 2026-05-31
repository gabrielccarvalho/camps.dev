import type { ReactNode } from "react"
import Image from "next/image"

import { Crosshair } from "@workspace/ui/components/crosshair"
import { Frame, FrameDivider } from "@workspace/ui/components/frame"

import type { Article } from "@/lib/content"

import { ArticleBody } from "./article-body"
import { ArticleHeader } from "./article-header"
import { ArticleToc } from "./article-toc"

type ArticleShellProps = {
  /** Eyebrow label, e.g. "Project" or "Writing". */
  label: string
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
function ArticleShell({ label, article, headerAction }: ArticleShellProps) {
  return (
    <Frame className="[--frame-width:1440px]">
      <FrameDivider />

      {/* Optional cover — joined with the title as one block (no divider). */}
      {article.meta.cover && (
        <div className="mx-auto w-full max-w-[1440px]">
          <div className="px-6 pt-8">
            <div className="relative aspect-[16/7] max-h-96 w-full overflow-hidden rounded-xl border border-border bg-muted">
              <Image
                src={article.meta.cover}
                alt={`${article.meta.title} cover`}
                fill
                sizes="(min-width: 1440px) 1392px, 100vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      )}

      <ArticleHeader
        label={label}
        meta={article.meta}
        readingTime={article.readingTime}
        action={headerAction}
      />

      <FrameDivider />

      <div className="relative mx-auto grid w-full max-w-[1440px] lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]">
        {/* Chapters aside (left) — pins from top-24 and rides the whole article
            body, handing off at the end (same sticky pattern as Projects). */}
        <aside className="hidden self-start px-6 py-16 lg:sticky lg:top-24 lg:block lg:pr-12">
          <ArticleToc items={article.toc} />
        </aside>

        {/* Prose column (right), separated by the inner rail. `min-w-0` lets the
            column shrink below its content's intrinsic width so long code lines
            scroll inside their block instead of blowing out the mobile layout. */}
        <div className="relative min-w-0 px-6 py-10 lg:border-l lg:border-border lg:py-16 lg:pl-12">
          {/* crosshair where the inner rail crosses the top divider */}
          <Crosshair position="top-left" className="hidden lg:block" />
          <ArticleBody content={article.content} />
        </div>
      </div>

      <FrameDivider />
    </Frame>
  )
}

export { ArticleShell }
