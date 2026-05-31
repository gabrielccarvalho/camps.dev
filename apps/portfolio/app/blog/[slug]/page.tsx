import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr"

import { Frame } from "@workspace/ui/components/frame"

import { ArticleShell } from "@/components/article/article-shell"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/sections/footer"
import { getAllSlugs, getArticle } from "@/lib/content"

type PageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAllSlugs("blog").map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const article = getArticle("blog", slug)
  if (!article) return {}
  return {
    title: article.meta.title,
    description: article.meta.description,
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const article = getArticle("blog", slug)
  if (!article) notFound()

  // Project writeups carry a `liveUrl` — surface it as a "Visit live" action.
  const { liveUrl } = article.meta
  const action = liveUrl ? (
    <a
      href={liveUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-1 text-sm font-medium underline decoration-1 underline-offset-4 transition-colors hover:text-primary"
    >
      Visit live
      <ArrowUpRight
        aria-hidden
        className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </a>
  ) : undefined

  return (
    <>
      <Navbar />
      <main className="overflow-x-clip">
        <ArticleShell label="Writing" article={article} headerAction={action} />
        <Frame className="[--frame-width:1440px]">
          <Footer />
        </Frame>
      </main>
    </>
  )
}
