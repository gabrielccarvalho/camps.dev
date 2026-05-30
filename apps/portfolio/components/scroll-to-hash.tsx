"use client"

import { useEffect } from "react"

const NAV_OFFSET = 96 // clear the sticky navbar

/**
 * Smoothly scrolls to the URL's hash target on mount and on hashchange, with the
 * navbar offset applied. Mounted on pages that own anchor sections so a
 * cross-page link like "/#projects" lands and glides into place after the
 * redirect. No-op when there's no hash.
 */
function ScrollToHash() {
  useEffect(() => {
    const scrollToHash = () => {
      const id = window.location.hash.slice(1)
      if (!id) return
      const el = document.getElementById(id)
      if (!el) return
      requestAnimationFrame(() => {
        const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET
        window.scrollTo({ top, behavior: "smooth" })
      })
    }

    scrollToHash()
    window.addEventListener("hashchange", scrollToHash)
    return () => window.removeEventListener("hashchange", scrollToHash)
  }, [])

  return null
}

export { ScrollToHash }
