# zenx — Monorepo Boilerplate Design

**Date:** 2026-06-01
**Status:** Approved
**Destination:** `/Users/gabe/www/personal/zenx` (fresh git repo, independent history)

## Goal

Extract the reusable infrastructure from `camps.dev` (the portfolio monorepo) into a
clean-slate boilerplate for the next project, `zenx`. Keep the shared design system,
all monorepo configuration, and the blueprint-frame layout primitives. Drop all
portfolio-specific content. Add two app skeletons (a Next.js `web` frontend and a
Fastify `backend`) and a shared-types package, so `zenx` starts as a ready-to-build
full-stack monorepo.

## Non-goals

- No portfolio content (sections, blog, articles, projects, assets) carried over.
- No features built in `web` beyond design-system wiring and a blank page.
- No business logic in `backend` beyond a health route demonstrating the stack.

## Build method

Selectively copy reusable source from `camps.dev` into `zenx`, then add the new
skeletons. **Never** copy `node_modules`, `.next`, `.turbo`, `.git`, or portfolio
content. After assembly: `pnpm install`, then verify `pnpm build`, `pnpm lint`, and
`pnpm typecheck` all pass before declaring done. Initialize a fresh git repo.

## Final layout

```
zenx/
├── apps/
│   ├── web/        # Next.js 16 — design system wired in, blank home page
│   │   └── CLAUDE.md
│   └── backend/    # Fastify — buildApp() factory + GET /health
│       └── CLAUDE.md
├── packages/
│   ├── ui/                  # @workspace/ui (intact: ~60 components + Frame/Crosshair)
│   │   └── CLAUDE.md
│   ├── shared/              # @workspace/shared (new) — cross-app types/contracts
│   │   └── CLAUDE.md
│   ├── eslint-config/       # @workspace/eslint-config (intact)
│   │   └── CLAUDE.md
│   └── typescript-config/   # @workspace/typescript-config (intact + node.json)
│       └── CLAUDE.md
├── turbo.json · pnpm-workspace.yaml · tsconfig.json
├── CLAUDE.md (root) · README.md · AGENTS.md
└── dotfiles (.gitignore, .prettierrc, .prettierignore, .eslintrc.js, .npmrc)
```

## Components

### Carried over intact

- **`packages/ui`** — `@workspace/ui`: all ~60 shadcn/Base-UI components,
  `frame.tsx` (`Frame` + `FrameDivider`), `crosshair.tsx` (`Crosshair`),
  `styles/globals.css` (all OKLCH design tokens + `animate-marquee`),
  `hooks/`, `lib/utils.ts`, `postcss.config.mjs`, `components.json`,
  `eslint.config.js`, `tsconfig.json`, `package.json`. Untouched.
- **`packages/eslint-config`** — `base.js`, `next.js`, `react-internal.js`.
  Untouched; `base.js` already serves a Node backend.
- **`packages/typescript-config`** — `base.json`, `nextjs.json`,
  `react-library.json` carried over.
- **Root configs** — `pnpm-workspace.yaml`, `turbo.json`, root `tsconfig.json`,
  `.gitignore`, `.prettierrc`, `.prettierignore`, `.eslintrc.js`, `.npmrc`,
  `AGENTS.md`. Root `package.json` carried over with `name` → `zenx`.

### New / modified

- **`packages/typescript-config/node.json`** (new) — extends `base.json`,
  overrides `lib: ["ES2022"]` (no DOM), enables emit with `outDir: "dist"`.
  Used by the backend.
- **`packages/shared`** (new) — `@workspace/shared`. Ships TS **source**
  (mirrors how `@workspace/ui` exports). `src/index.ts` with a small example
  contract (e.g. a `HealthResponse` type). Subpath exports, `base.json`
  tsconfig, `base` eslint. Consumed by `backend` (used now) and listed as a dep
  of `web` + added to its `transpilePackages` (available, not yet used).
- **`apps/web`** (Next.js, derived from the portfolio app, stripped):
  - **Keep:** `app/layout.tsx` (fonts + `ThemeProvider` + `globals.css`),
    `theme-provider.tsx`, `theme-toggle.tsx`, `next.config.ts`
    (`transpilePackages` incl. `@workspace/shared`), `postcss.config.mjs`,
    `eslint.config.js`, `tsconfig.json`, `components.json`, `favicon.ico`,
    `package.json` (renamed `portfolio` → `web`).
  - **Blank `app/page.tsx`** — minimal placeholder (heading + theme toggle).
  - **Drop:** all `sections/`, `navbar`, `container`, `scroll-to-hash`,
    `smooth-link`, `article/`, `blog/` routes, `content/`,
    `lib/{content,markdown,projects}.ts`, portfolio `public/` assets, and blog
    deps (`gray-matter`, `rehype-*`, `remark-*`, `shiki`, `unified`,
    `github-slugger`, `@types/hast`). `Frame`/`Crosshair` remain available from
    `@workspace/ui`.
- **`apps/backend`** (Fastify, new):
  - **Structure:** `src/index.ts` (boot + listen), `src/app.ts` (`buildApp()`
    factory returning a configured Fastify instance), `src/routes/health.ts`
    (`GET /health` returning a `HealthResponse` from `@workspace/shared`).
  - **Tooling:** `tsx watch src/index.ts` for `dev`, `tsup` for `build`
    (`noExternal: [/@workspace\//]` so the shared package bundles in),
    `node dist/index.js` for `start`. `tsconfig.json` extends
    `@workspace/typescript-config/node.json`; `eslint.config.js` uses
    `@workspace/eslint-config/base`.
  - **Port 3001** (web stays on 3000).

### Turbo / docs glue

- **`turbo.json`** — `build.outputs` extended to include `"dist/**"` alongside
  `.next/**` (for backend + any compiled output).
- **`README.md`** — rewritten generic (current one references
  "portfolio"/"shadcn template").
- **CLAUDE.md files** — one per workspace plus a root file:
  - **Root `CLAUDE.md`** — monorepo overview: pnpm + Turborepo layout, the two
    apps + shared packages, the full tech stack table, commands, conventions,
    and the architecture rationale (why Fastify, why a shared package, how types
    flow web ↔ backend, the blueprint-frame design system in `@workspace/ui`).
  - **`apps/web/CLAUDE.md`** — Next.js app: App Router + RSC, fonts/theming
    wiring, how to consume `@workspace/ui` and `@workspace/shared`, Base-UI
    `render`-prop conventions, where new shadcn components land.
  - **`apps/backend/CLAUDE.md`** — Fastify app: `buildApp()` pattern, route
    structure, tsx/tsup tooling, port, how it imports shared contracts.
  - **`packages/ui/CLAUDE.md`** — the design system: Tailwind v4 CSS-first
    tokens, the blueprint-frame primitives (`Frame`/`FrameDivider`/`Crosshair`)
    and their composition rules, subpath exports, shadcn `base-nova` setup.
  - **`packages/shared/CLAUDE.md`** — the contract package: what belongs here
    (cross-app types), how it's exported and consumed.
  - **`packages/eslint-config/CLAUDE.md`** and
    **`packages/typescript-config/CLAUDE.md`** — what each preset is for and
    when to extend which (`base` vs `next-js`/`react-internal`; `base` vs
    `nextjs`/`react-library`/`node`).
- `docs/` portfolio spec not carried over.

## Data flow (type sharing)

`@workspace/shared` defines API contracts (e.g. `HealthResponse`). The Fastify
backend imports the type to shape its `GET /health` response. The `web` app lists
`@workspace/shared` as a dependency and has it in `transpilePackages`, so a future
client fetch can import the same type for end-to-end type safety. Turbo's
`^build` dependency ordering ensures dependencies build before dependents.

## Verification / success criteria

- `pnpm install` succeeds at `zenx` root.
- `pnpm build` builds `web`, `backend`, `shared`, and `ui` with no errors.
- `pnpm typecheck` and `pnpm lint` pass across all workspaces.
- `pnpm dev` starts `web` on :3000 and `backend` on :3001; `GET /health` returns
  the typed response.
- A `CLAUDE.md` exists at root and in every workspace, each accurately describing
  that unit's infrastructure and architecture.
- No portfolio content remains anywhere in `zenx`.

## Open decisions resolved

- **Output location:** `/Users/gabe/www/personal/zenx`.
- **Apps:** `web` (Next.js, nothing built) + `backend` (Fastify).
- **Backend tooling:** `tsx` (dev) + `tsup` (build). Pure-`tsc` alternative
  declined in favor of bundling the shared source cleanly.
- **Web baseline:** design-system wiring only (no navbar/container/sections).
- **Shared types:** `packages/shared` (`@workspace/shared`), ships source.
- **Blog system:** dropped entirely.
- **Docs:** per-workspace + root `CLAUDE.md`.
