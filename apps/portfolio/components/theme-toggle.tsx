"use client"

import { Moon, Sun } from "@phosphor-icons/react"
import { useTheme } from "next-themes"

import { cn } from "@workspace/ui/lib/utils"

function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground",
        className
      )}
    >
      {/* Icons are toggled by the `dark` class on <html> (set by next-themes),
          so there's no client state or hydration flash. */}
      <Sun aria-hidden className="hidden size-5 dark:block" />
      <Moon aria-hidden className="size-5 dark:hidden" />
    </button>
  )
}

export { ThemeToggle }
