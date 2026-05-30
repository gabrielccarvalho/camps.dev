import { cn } from "@workspace/ui/lib/utils"

import { renderMarkdown } from "@/lib/markdown"

// Async server component: renders the markdown body to themed prose. Highlighting
// runs server-side via the unified pipeline, so the HTML arrives fully styled.
async function ArticleBody({
  content,
  className,
}: {
  content: string
  className?: string
}) {
  const html = await renderMarkdown(content)

  return (
    <div
      className={cn("prose max-w-none", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export { ArticleBody }
