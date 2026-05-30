"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ComponentProps, MouseEvent } from "react"

const NAV_OFFSET = 96 // clear the sticky navbar

/**
 * A next/link that smooth-scrolls to an in-page anchor when the target section
 * lives on the current page. When it's on a different route (e.g. a "/#projects"
 * link clicked from a blog post), it falls through to normal navigation — and
 * <ScrollToHash /> on the destination page performs the smooth scroll on arrival.
 */
function SmoothLink({ href, onClick, ...props }: ComponentProps<typeof Link>) {
  const pathname = usePathname()

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (event.defaultPrevented) return
    if (typeof href !== "string" || !href.includes("#")) return

    const [path, hash] = href.split("#")
    const targetPath = path || "/"
    if (!hash || pathname !== targetPath) return // different page → navigate

    const el = document.getElementById(hash)
    if (!el) return
    event.preventDefault()
    const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET
    window.scrollTo({ top, behavior: "smooth" })
    window.history.replaceState(null, "", `#${hash}`)
  }

  return <Link href={href} onClick={handleClick} {...props} />
}

export { SmoothLink }
