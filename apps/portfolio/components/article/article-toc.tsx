"use client"

import { useEffect, useRef, useState, type MouseEvent } from "react"

import { cn } from "@workspace/ui/lib/utils"

import type { TocItem } from "@/lib/content"

const NAV_OFFSET = 96 // clear the sticky navbar

/**
 * Sticky "chapters" side-tab. A muted track runs down the left; a solid fill
 * grows as you scroll, its bottom edge tracking your reading position and
 * interpolating smoothly from one chapter to the next. The chapter under the
 * navbar reads in full foreground. Pure scroll math, no library.
 */
function ArticleToc({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null)
  const [fillHeight, setFillHeight] = useState(0)
  const listRef = useRef<HTMLUListElement>(null)
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({})

  useEffect(() => {
    if (items.length === 0) return

    const headings = items
      .map((item) => ({ id: item.id, el: document.getElementById(item.id) }))
      .filter((h): h is { id: string; el: HTMLElement } => h.el !== null)
    if (headings.length === 0) return

    const docTop = (el: HTMLElement) =>
      el.getBoundingClientRect().top + window.scrollY

    const update = () => {
      const scrollPos = window.scrollY + NAV_OFFSET

      // Active = last heading that has scrolled past the navbar line.
      let activeIndex = 0
      headings.forEach((heading, index) => {
        if (docTop(heading.el) <= scrollPos) activeIndex = index
      })

      const current = headings[activeIndex]
      if (!current) return
      const next = headings[activeIndex + 1]
      setActiveId(current.id)

      // How far between the active heading and the next boundary we've scrolled.
      const start = docTop(current.el)
      const end = next
        ? docTop(next.el)
        : document.documentElement.scrollHeight - window.innerHeight + NAV_OFFSET
      const frac =
        end > start ? Math.min(1, Math.max(0, (scrollPos - start) / (end - start))) : 1

      // Map that onto the list: fill from the bottom of the active item toward
      // the bottom of the next item (or the list end), so the line "reaches" a
      // chapter as it becomes active and keeps creeping toward the next.
      const list = listRef.current
      const currentLi = itemRefs.current[current.id]
      if (!list || !currentLi) return
      const listTop = list.getBoundingClientRect().top
      const bottomOf = (li: HTMLLIElement) =>
        li.getBoundingClientRect().bottom - listTop

      const from = bottomOf(currentLi)
      const nextLi = next ? itemRefs.current[next.id] : null
      const to = nextLi ? bottomOf(nextLi) : list.getBoundingClientRect().height
      setFillHeight(from + frac * (to - from))
    }

    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        update()
        ticking = false
      })
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [items])

  const handleNavigate = (
    event: MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    const el = document.getElementById(id)
    if (!el) return
    event.preventDefault()
    const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET
    window.scrollTo({ top, behavior: "smooth" })
    window.history.replaceState(null, "", `#${id}`)
  }

  if (items.length === 0) return null

  return (
    <nav aria-label="Table of contents">
      <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
        Chapters
      </p>

      <div className="relative mt-4">
        {/* track + scroll-driven fill */}
        <div
          aria-hidden
          className="absolute top-0 left-0 h-full w-px bg-border"
        />
        <div
          aria-hidden
          className="absolute top-0 left-0 w-px bg-foreground"
          style={{ height: fillHeight }}
        />

        <ul ref={listRef}>
          {items.map((item) => (
            <li
              key={item.id}
              ref={(el) => {
                itemRefs.current[item.id] = el
              }}
            >
              <a
                href={`#${item.id}`}
                onClick={(event) => handleNavigate(event, item.id)}
                className={cn(
                  "block py-1.5 pl-4 text-sm transition-colors",
                  item.level === 3 && "pl-7",
                  activeId === item.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export { ArticleToc }
