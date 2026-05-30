---
title: "Building a blueprint-frame layout in Tailwind v4"
description: "How the rails, dividers, and crosshairs on this site come together with pure CSS — no JavaScript, no scroll-spy."
date: "2026-05-20"
author: "Gabriel Carvalho"
authorImage: "/authors/gabriel-carvalho.jpeg"
cover: "/blog/blueprint-frame.svg"
tags: ["Tailwind", "CSS", "Layout"]
---

This site is wrapped in a "blueprint frame" — a centered content column bounded by
faint vertical rails, with little crosshair marks wherever a line meets another.
None of it needs JavaScript. Here's how the pieces fit together.

## The content column

Everything important lives inside a single 1440px column. A `Frame` component draws
two continuous vertical rails at that column's edges as a centered overlay, while the
content itself stays full-bleed. The width is a CSS variable so a section can opt into
a different measure without touching the component.

```tsx
function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute inset-0 mx-auto w-full max-w-[var(--frame-width,80rem)] border-x border-border" />
      {children}
    </div>
  )
}
```

## Dividers between sections

Section boundaries use a full-bleed horizontal rule. The trick is that the rule spans
the whole viewport, but the crosshairs that punctuate it are positioned by an *inner*
column that matches the rail width — so the marks always land exactly where the rails
cross the line.

### Why crosshairs read as "blueprint"

A plus sign at every intersection is a small thing, but it signals intent: the layout
is on a grid, and the grid is the point. Keeping them faint (`text-muted-foreground/40`)
means they decorate without shouting.

## The sticky table of contents

The one place JavaScript earns its keep is the chapter list you're reading from now. A
tiny `IntersectionObserver` watches the headings and highlights whichever one is under
the navbar. Everything else — the rails, the dividers, the marks — is plain CSS.

## Wrapping up

Pure-CSS structure, a sprinkle of JS only where it changes with scroll. That balance
keeps the whole thing fast and easy to reason about.
