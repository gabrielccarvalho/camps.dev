import Link from "next/link"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"

import { FrameDivider } from "@workspace/ui/components/frame"

import { BlogGrid } from "@/components/sections/blog-grid"
import { getAllArticles } from "@/lib/content"

function Blog() {
  // Show the latest few on the homepage; the full list lives at /blog.
  const posts = getAllArticles("blog").slice(0, 6)

  return (
    <section id="blog">
      {/* Section header */}
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 px-6 py-16">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-muted-foreground">Writing</p>
            <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              From the blog
            </h2>
            <p className="mt-3 text-pretty text-muted-foreground">
              Notes on building things for the web — design, code, and the bits
              in between.
            </p>
          </div>
          <Link
            href="/blog"
            className="group inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            View all writing
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>

      {/* Full-bleed divider between the header and the grid */}
      <FrameDivider />

      <BlogGrid posts={posts} />
    </section>
  )
}

export { Blog }
