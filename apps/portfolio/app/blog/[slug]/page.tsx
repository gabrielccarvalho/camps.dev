import type { Metadata } from "next"
import { notFound } from "next/navigation"

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

  return (
    <>
      <Navbar />
      <main className="overflow-x-clip">
        <ArticleShell label="Writing" article={article} />
        <Frame className="[--frame-width:1440px]">
          <Footer />
        </Frame>
      </main>
    </>
  )
}
