import fs from "node:fs"
import path from "node:path"

import matter from "gray-matter"
import GithubSlugger from "github-slugger"

/** The two content collections, each a folder of markdown files under `content/`. */
export type Collection = "blog" | "projects"

/** Frontmatter + slug for a single article. Project-only fields are optional. */
export type ArticleMeta = {
  slug: string
  title: string
  description: string
  date: string // ISO 8601
  author?: string
  authorImage?: string
  tags?: string[]
  cover?: string
  // Project deep-dives carry a few extra fields:
  liveUrl?: string
  stack?: string[]
}

/** One entry in an article's table of contents (its "chapters"). */
export type TocItem = {
  id: string
  text: string
  level: 2 | 3
}

export type Article = {
  meta: ArticleMeta
  /** Raw markdown body (frontmatter stripped). Rendered by <ArticleBody />. */
  content: string
  toc: TocItem[]
  /** Estimated reading time in minutes. */
  readingTime: number
}

const CONTENT_DIR = path.join(process.cwd(), "content")

function collectionDir(collection: Collection) {
  return path.join(CONTENT_DIR, collection)
}

function toMeta(slug: string, data: Record<string, unknown>): ArticleMeta {
  const date = data.date ? new Date(data.date as string) : new Date(0)
  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    date: date.toISOString(),
    author: data.author ? String(data.author) : undefined,
    authorImage: data.authorImage ? String(data.authorImage) : undefined,
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : undefined,
    cover: data.cover ? String(data.cover) : undefined,
    liveUrl: data.liveUrl ? String(data.liveUrl) : undefined,
    stack: Array.isArray(data.stack) ? (data.stack as string[]) : undefined,
  }
}

/** Strip inline markdown emphasis/link syntax so TOC text reads cleanly. */
function cleanHeadingText(raw: string) {
  return raw
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // links → label
    .replace(/[*_`]/g, "") // emphasis / inline code
    .replace(/#*\s*$/, "") // trailing closing hashes
    .trim()
}

/**
 * Build the table of contents from the markdown body. Fenced code blocks are
 * removed first so `#` lines inside them are never mistaken for headings. Slugs
 * are generated with the same `github-slugger` algorithm `rehype-slug` uses at
 * render time, so the TOC anchors line up with the heading `id`s exactly.
 */
function buildToc(markdown: string): TocItem[] {
  const slugger = new GithubSlugger()
  const withoutCode = markdown.replace(/```[\s\S]*?```/g, "")
  const items: TocItem[] = []

  for (const line of withoutCode.split("\n")) {
    const match = /^(#{2,3})\s+(.+)$/.exec(line)
    if (!match) continue
    const [, hashes, rawText] = match
    if (!hashes || !rawText) continue
    const text = cleanHeadingText(rawText)
    if (!text) continue
    items.push({
      id: slugger.slug(text),
      text,
      level: hashes.length as 2 | 3,
    })
  }

  return items
}

function estimateReadingTime(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

/** All slugs in a collection (drives `generateStaticParams`). */
export function getAllSlugs(collection: Collection): string[] {
  const dir = collectionDir(collection)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""))
}

/** Metadata for every article in a collection, newest first. */
export function getAllArticles(collection: Collection): ArticleMeta[] {
  return getAllSlugs(collection)
    .map((slug) => {
      const raw = fs.readFileSync(
        path.join(collectionDir(collection), `${slug}.md`),
        "utf8"
      )
      return toMeta(slug, matter(raw).data)
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

/** A single article (meta + body + TOC), or `null` if the slug doesn't exist. */
export function getArticle(collection: Collection, slug: string): Article | null {
  const fullPath = path.join(collectionDir(collection), `${slug}.md`)
  if (!fs.existsSync(fullPath)) return null

  const { data, content } = matter(fs.readFileSync(fullPath, "utf8"))
  return {
    meta: toMeta(slug, data),
    content,
    toc: buildToc(content),
    readingTime: estimateReadingTime(content),
  }
}
