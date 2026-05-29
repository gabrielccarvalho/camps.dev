# camps.dev

Personal portfolio site for Gabriel Carvalho, built as a Turborepo monorepo with a
shared design system.

## Architecture

A **pnpm + Turborepo** monorepo. Workspaces are defined in `pnpm-workspace.yaml` as
`apps/*` and `packages/*`.

```
camps.dev/
├── apps/
│   └── portfolio/          # The Next.js site (package name: "portfolio")
├── packages/
│   ├── ui/                 # @workspace/ui — shared design system / components
│   ├── eslint-config/      # @workspace/eslint-config — shared ESLint config
│   └── typescript-config/  # @workspace/typescript-config — shared tsconfig presets
├── turbo.json              # Task pipeline (build, lint, format, typecheck, dev)
└── pnpm-workspace.yaml
```

Internal packages are referenced via `workspace:*` and the `@workspace/*` npm scope.

> Note: `apps/web/` may linger as an empty `.next/` build artifact from a past rename
> (`web` → `portfolio`). It is not a real workspace and can be deleted.

## Tech stack

| Concern        | Choice |
| -------------- | ------ |
| Package manager| pnpm `10.33.4` (Node `>=20`) |
| Monorepo       | Turborepo `^2.9` |
| Framework      | Next.js `16.2.6` (App Router, **Turbopack**, RSC) |
| Runtime        | React `19.2.4` |
| Language       | TypeScript `^5` |
| Styling        | Tailwind CSS **v4** (CSS-first, `@tailwindcss/postcss`) |
| Components     | shadcn (`base-nova` style) on **Base UI** (`@base-ui/react`) — *not* Radix |
| Icons          | Phosphor (`@phosphor-icons/react`) |
| Theming        | `next-themes` (class strategy) |
| Formatting     | Prettier + `prettier-plugin-tailwindcss` |

## Commands

Run from the repo root (Turbo fans out to workspaces):

```
pnpm dev         # turbo dev (persistent, uncached)
pnpm build       # turbo build
pnpm lint        # turbo lint
pnpm format      # turbo format (prettier --write)
pnpm typecheck   # turbo typecheck (tsc --noEmit)
```

The portfolio app itself exposes the same scripts (`next dev`, `next build`, etc.) under
`apps/portfolio`.

## The portfolio app (`apps/portfolio`)

```
app/
├── layout.tsx       # Root layout: fonts + ThemeProvider
└── page.tsx         # Home page: Navbar + framed sections (Hero, ticker, Projects)
components/
├── navbar.tsx       # Site navbar (sticky, framed)
├── container.tsx    # Centered content column (max-w-[1440px], px-6)
├── theme-provider.tsx
└── sections/        # hero.tsx, logo-ticker.tsx, projects.tsx
hooks/ · lib/        # App-local hooks and utilities
public/              # Static assets (avatar.png, logos/)
```

`next.config.ts` sets `transpilePackages: ["@workspace/ui"]` so the shared package is
compiled by the app.

## The UI package (`@workspace/ui`)

The shared design system under `packages/ui/src`:

- `components/` — ~55 shadcn components built on Base UI primitives, plus custom
  layout primitives: `frame.tsx` (`Frame` + `FrameDivider`) and `crosshair.tsx`
  (`Crosshair`). See **Layout & framing** below.
- `lib/utils.ts` — the `cn()` helper (`clsx` + `tailwind-merge`).
- `hooks/` — shared hooks.
- `styles/globals.css` — the single source of truth for Tailwind v4 setup and **all
  design tokens**. Also defines the `animate-marquee` utility (`--animate-marquee` +
  keyframes), driven by a `--marquee-duration` variable.

Exports are subpath-based (see `packages/ui/package.json`):

```ts
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import "@workspace/ui/globals.css"
```

shadcn is configured in `apps/portfolio/components.json`: `style: "base-nova"`,
`baseColor: "neutral"`, `iconLibrary: "phosphor"`, with the `ui` alias pointing at
`@workspace/ui/components`. New shadcn components land in the **ui package**, not the app.

## Conventions

### Imports & path aliases

- `@/*` → the portfolio app root (e.g. `@/components/navbar`).
- `@workspace/ui/*` → `packages/ui/src/*`.
- Group imports: external packages first, then `@workspace/*`, then `@/*` (blank line
  between groups).

### Components

- Function declarations with a **named export at the bottom**: `export { Hero }` — not
  `export default`.
- Compose classes with `cn(...)`; never hand-concatenate class strings.
- Default to **Server Components**; add `"use client"` only when needed (e.g.
  `theme-provider.tsx`). For icons in server components, import from the SSR entry:
  `@phosphor-icons/react/dist/ssr`.

### Base UI (not Radix)

Polymorphism uses the **`render` prop**, not `asChild`:

```tsx
<Button render={<Link href="/x" />}>Go</Button>
```

Base UI buttons default to `nativeButton: true` and warn if the rendered element isn't a
real `<button>`. Use a plain link for link-styled CTAs instead.

### Styling & theming

- Tailwind **v4** — configured in CSS (`@import`, `@theme`), no `tailwind.config` file.
- Design tokens are CSS variables in `packages/ui/src/styles/globals.css`, defined in
  **OKLCH**, with light values under `:root` and dark overrides under `.dark`. Reference
  them via semantic utilities (`bg-primary`, `text-muted-foreground`, `border-border`,
  etc.) rather than raw color values.
- `--primary` is a neutral gray (near-black in light, light gray in dark).
- Theme is class-based via `next-themes`; **default theme is `light`**.

### Fonts

Loaded with `next/font/google` in `app/layout.tsx`, exposed as CSS variables and wired
into Tailwind:

| Variable        | Font        | Use |
| --------------- | ----------- | --- |
| `--font-heading`| Figtree     | Headings (`font-heading`) |
| `--font-sans`   | Inter       | Body / default sans |
| `--font-mono`   | Geist Mono  | Monospace |

## Layout & framing

The site uses a "blueprint frame" aesthetic — a centered content column bounded by
vertical guide **rails**, with crosshair `+` marks at line intersections. Three
primitives in `@workspace/ui` implement it:

- **`Crosshair`** — a positioned `+` mark; `position` is `top-left` | `top-right` |
  `bottom-left` | `bottom-right` (centers the mark on that corner of the parent).
- **`Frame`** — a full-bleed region that draws the vertical rails as a centered overlay
  at `--frame-width` (CSS variable). Content inside gets rails; content outside stays
  full-bleed. The site sets `--frame-width: 1440px` via `[--frame-width:1440px]`.
- **`FrameDivider`** — a full-width horizontal rule with crosshairs where the rails
  cross it (positioned by an inner centered `--frame-width` column). Place between
  framed sections.

Rules of thumb:

- The content column is **1440px**: the `Frame`'s `--frame-width` and `Container`'s
  `max-w-[1440px]` must agree. Sections needing rail-aligned dividers skip `Container`
  and align to the rails directly (a `max-w-[1440px]` wrapper with no x-padding), padding
  each cell inward instead.
- **Section-boundary dividers are full-bleed** (`FrameDivider`); **dividers inside a
  section are column-width** (a plain `border-t` spanning rail-to-rail).
- A section **opts out** of the frame by living outside `<Frame>`. An unframed section in
  the middle means splitting into two frames around it (that's how the logo ticker is a
  full-bleed band between the hero frame and the projects frame).
- Crosshairs mark every rail × divider intersection — outer rails and inner rails alike
  (e.g. the projects' aside|content split).
- Lines use the `border-border` token; crosshairs use `text-muted-foreground/40`.

## Sections (`apps/portfolio/components/sections`)

- **`hero.tsx`** — full-bleed within its frame, `h-[calc(100svh-12rem)]`. Indigo→violet
  and teal blurred glow centered behind a faint grid; avatar on the right at `lg+`.
- **`logo-ticker.tsx`** — seamless infinite `animate-marquee` of company logos. Logos
  render as **uniform monochrome silhouettes via CSS `mask-image`**, which sidesteps each
  SVG's native colors (white/colored logos all read the same). Full-bleed band, no rails.
- **`projects.tsx`** — "Latest projects". Each project is its own grid row whose **name
  pins on the left (`lg:sticky lg:top-24`) and hands off to the next** as you scroll —
  pure CSS, no JS or scroll-spy. Rows are divided by column-width crosshair lines; the
  header↔projects divider is full-bleed. Below `lg` it collapses to a single column.

## Commit messages

Follow the semantic (Conventional Commits) pattern:

```
type(scope): summary
```

- **type** — one of: `chore`, `docs`, `feat`, `fix`, `refactor`, `style`, `test`.
- **scope** — the area of the change, in parentheses (e.g. `portfolio`, `ui`, `deps`).
- **summary** — written in the present tense, briefly describing what the change does.

Keep the summary short and focused on the *what*. If more explanation is needed, add it as a commit description (body) below the subject line.

### Examples

```
feat(portfolio): add hero section to landing page
fix(ui): correct button focus ring color
chore(deps): bump next to 16.2.6
refactor(portfolio): extract project card into its own component
```
