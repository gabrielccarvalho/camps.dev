# Blog section — design

**Date:** 2026-05-29
**Status:** Approved
**Scope:** Add a mocked "blog posts" section to the portfolio homepage that follows
the existing blueprint-frame aesthetic (vertical rails + horizontal dividers +
crosshairs at intersections).

## Goal

Highlight blog posts on the homepage. There is no blog or CMS yet — this is a
purely visual, mocked-up section. Content is local placeholder data.

## Placement

The `Blog` section is the **last section** on the page, after the (full-bleed,
unframed) `Newsletter` band. It gets its own `Frame` with framing dividers top and
bottom, mirroring how `Projects` is wrapped:

```tsx
<Newsletter />
<Frame className="[--frame-width:1440px]">
  <FrameDivider />   {/* seam between the Newsletter band and Blog */}
  <Blog />
  <FrameDivider />   {/* closes the page */}
</Frame>
```

The Newsletter is a `BleedCard` with no terminating divider, so the Blog's leading
`FrameDivider` provides the visual seam.

## Files

- **New:** `apps/portfolio/components/sections/blog.tsx`
  - Named export at the bottom: `export { Blog }`.
  - Same conventions as `projects.tsx` (import grouping, `cn()`, Phosphor icons).
- **Edit:** `apps/portfolio/app/page.tsx` — import `Blog` and render it inside a new
  `Frame` after `<Newsletter />`.
- **No new UI-package primitives.** Reuses `Frame`, `FrameDivider`, `Crosshair`.

## Section anatomy (inside `blog.tsx`)

1. **Header block** — rail-aligned (`mx-auto w-full max-w-[1440px]`, padded inward),
   following the Projects header rhythm:
   - eyebrow: `Writing` (`text-sm font-medium text-muted-foreground`)
   - `h2`: "From the blog" (`font-heading text-3xl font-bold ... sm:text-4xl`)
   - short subtitle (`text-muted-foreground`)
2. A `<FrameDivider />` (full-bleed) between the header and the grid.
3. The card lattice.

## The lattice (6 mock posts, 2 rows × 3 columns)

- A `max-w-[1440px]` wrapper aligned to the rails (no x-padding); cells pad inward.
- Grid: `grid-cols-1 lg:grid-cols-3`. Below `lg` the grid collapses to a single
  stacked column.
- **Each card is a `Link`** (whole card clickable, carries `group`) that *is* the
  grid cell, so the borders between cells draw the lattice.

### Borders

For card index `i` (0–5), `col = i % 3`, `row = floor(i / 3)`:

- Inner vertical rails: `lg:border-l border-border` when `col > 0` (columns 2 & 3).
- Horizontal dividers:
  - Mobile (stacked): `border-t border-border` when `i > 0`.
  - At `lg`: keep `border-t` only for the second row (`row > 0`); remove it for
    row-0 non-first cards (`lg:border-t-0` on `i === 1` and `i === 2`).
- The outer rails come from the enclosing `Frame`; the top/bottom horizontal lines
  come from the two `FrameDivider`s.

### Crosshairs

Crosshairs mark **every** rail × line intersection. The four outer corners are
already provided by the two `FrameDivider`s. The remaining intersections, rendered
on the lattice cells with `hidden lg:block` (inner-lattice marks only exist at
`lg`):

- inner-rail tops (line T = header↔grid divider): `top-left` on cards 2 & 3
- middle row line (M): `top-left` on cards 4, 5 & 6, plus `top-right` on card 6
  (right rail × M)
- inner-rail bottoms (line B = closing divider): `bottom-left` on cards 5 & 6

On mobile, stacked-card dividers get rail crosshairs (`top-left` + `top-right`,
`lg:hidden`) for cards `i > 0`, matching the `Projects` mobile dividers.

## Card anatomy (vertical stack)

`Link` cell: `group relative flex flex-col`, padded inward, subtle hover feedback
`transition-colors hover:bg-muted/40`.

- **Image placeholder** on top: `aspect-[16/10] w-full overflow-hidden rounded-lg
  border border-border bg-muted` — ready to swap for `<Image/>` when real cover
  images exist.
- **Title:** `font-heading` semibold.
- **Description:** `text-sm text-muted-foreground text-pretty`.
- **Footer** pinned to the bottom (`mt-auto`), an `ArrowUpRight` (Phosphor) at the
  **bottom-right** that nudges `group-hover:translate-x-0.5 group-hover:-translate-y-0.5`
  with `transition-transform duration-200`, matching the Projects arrow easing.

## Data

A local `posts` array of 6 placeholder objects, clearly commented as mock:

```ts
{ id, title, description, href: "#" }
```

No real blog is wired up; `href` points to `#`.

## Out of scope (YAGNI)

- Real blog content, MDX, CMS, or routing.
- Post dates, tags, read-time, or author meta (spec is image + title + description
  + arrow only).
- Pagination or "view all" links.

## Verification

- `pnpm typecheck`, `pnpm lint`, `pnpm build` succeed.
- Visually: rails and crosshairs align at every intersection at `lg`; the grid
  collapses cleanly to one column below `lg`; the arrow nudges on card hover; no
  horizontal overflow (the existing `overflow-x-clip` on `main` already guards the
  crosshair bleed).
