/**
 * Curated project showcase. Drives the homepage Projects section and the
 * footer's Projects column.
 *
 * A project with `hasPost: true` has a full writeup at `/blog/[id]` (its `id`
 * matches the blog slug), so its links point there. Without it, links go to the
 * live product site (`href`) instead.
 */
export type ShowcaseProject = {
  id: string
  title: string
  description: string
  tags: string[]
  /** The live product site. */
  href: string
  image?: string
  /** Whether a full writeup exists at `/blog/[id]`. */
  hasPost?: boolean
}

export const projects: ShowcaseProject[] = [
  {
    id: "adviso",
    title: "Adviso",
    description:
      "An AI-focused tool to analyze and improve your ad campaigns across social media — Facebook, Instagram, TikTok, Google Ads, and many more.",
    tags: ["Next.js", "React", "AI", "Node", "Postgres"],
    href: "https://adviso.com.br/",
    image: "/projects/adviso.png",
    hasPost: true,
  },
  {
    id: "zimo",
    title: "Zimo",
    description:
      "A personal assistant on WhatsApp that keeps track of all your finances, meetings, and schedule — right inside your chats.",
    tags: ["Next.js", "React", "AI"],
    href: "https://zimo.app.br/",
    image: "/projects/zimo.png",
  },
]
