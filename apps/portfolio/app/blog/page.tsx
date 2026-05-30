import type { Metadata } from "next"

import { Frame, FrameDivider } from "@workspace/ui/components/frame"

import { Navbar } from "@/components/navbar"
import { BlogGrid } from "@/components/sections/blog-grid"
import { Footer } from "@/components/sections/footer"
import { getAllArticles } from "@/lib/content"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes on building things for the web — design, code, and the bits in between.",
}

export default function BlogIndexPage() {
  const posts = getAllArticles("blog")

  return (
    <>
      <Navbar />
      <main className="overflow-x-clip">
        <Frame className="[--frame-width:1440px]">
          <FrameDivider />

          <div className="mx-auto w-full max-w-[1440px]">
            <div className="max-w-2xl px-6 py-16">
              <p className="text-sm font-medium text-muted-foreground">
                Writing
              </p>
              <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                From the blog
              </h1>
              <p className="mt-3 text-pretty text-muted-foreground">
                Notes on building things for the web — design, code, and the
                bits in between.
              </p>
            </div>
          </div>

          <FrameDivider />

          <BlogGrid posts={posts} />

          <FrameDivider />
        </Frame>

        <Frame className="[--frame-width:1440px]">
          <Footer />
        </Frame>
      </main>
    </>
  )
}
