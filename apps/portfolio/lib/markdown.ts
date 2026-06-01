import type { ElementContent } from "hast"
import rehypeAutolinkHeadings, {
  type Options as RehypeAutolinkOptions,
} from "rehype-autolink-headings"
import rehypePrettyCode, {
  type Options as RehypePrettyCodeOptions,
} from "rehype-pretty-code"
import rehypeSlug from "rehype-slug"
import rehypeStringify from "rehype-stringify"
import remarkGfm from "remark-gfm"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { unified } from "unified"

// Dual-theme highlighting. `keepBackground: false` lets the prose container own
// the code-block background (a token-driven surface), while token colors come
// from Shiki via the --shiki-light / --shiki-dark variables. globals.css swaps
// to --shiki-dark under `.dark`.
const prettyCodeOptions: RehypePrettyCodeOptions = {
  theme: { light: "github-light", dark: "github-dark" },
  keepBackground: false,
}

// A link/chain glyph appended to each heading. Built as a hast node (this runs
// in the rehype tree, not JSX), styled to fade in on heading hover via the
// `.heading-anchor` rules in globals.css.
const linkIcon: ElementContent = {
  type: "element",
  tagName: "svg",
  properties: {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  },
  children: [
    {
      type: "element",
      tagName: "path",
      properties: { d: "M9 17H7A5 5 0 0 1 7 7h2" },
      children: [],
    },
    {
      type: "element",
      tagName: "path",
      properties: { d: "M15 7h2a5 5 0 1 1 0 10h-2" },
      children: [],
    },
    {
      type: "element",
      tagName: "line",
      properties: { x1: 8, y1: 12, x2: 16, y2: 12 },
      children: [],
    },
  ],
}

// Wrap each heading's id in an anchor that links to itself. `behavior: "append"`
// keeps the heading text untouched and adds the icon after it.
const autolinkOptions: RehypeAutolinkOptions = {
  behavior: "append",
  properties: {
    className: ["heading-anchor"],
    "aria-label": "Link to this section",
  },
  content: () => [structuredClone(linkIcon)],
}

/**
 * Render a markdown string to an HTML string with GFM support, heading anchors
 * (`rehype-slug`, matching the TOC slugs), and Shiki syntax highlighting. Async
 * because Shiki loads its highlighter asynchronously — call it from a server
 * component and `await` the result.
 */
export async function renderMarkdown(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, autolinkOptions)
    .use(rehypePrettyCode, prettyCodeOptions)
    .use(rehypeStringify)
    .process(markdown)

  return String(file)
}
