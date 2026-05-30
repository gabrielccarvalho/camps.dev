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
    .use(rehypePrettyCode, prettyCodeOptions)
    .use(rehypeStringify)
    .process(markdown)

  return String(file)
}
