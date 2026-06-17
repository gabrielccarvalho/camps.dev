# zenx Monorepo Boilerplate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Assemble a clean-slate full-stack monorepo boilerplate at `/Users/gabe/www/personal/zenx` from `camps.dev`'s reusable infrastructure — the `@workspace/ui` design system, all monorepo configs, a blank Next.js `web` app, a new Fastify `backend`, a `@workspace/shared` types package, and per-workspace + root `CLAUDE.md` docs.

**Architecture:** pnpm + Turborepo monorepo. `apps/web` (Next.js 16, design-system wired, nothing built) and `apps/backend` (Fastify, `buildApp()` + `GET /health`) consume shared workspace packages: `@workspace/ui` (intact design system + blueprint-frame primitives), `@workspace/shared` (cross-app TS types/contracts), `@workspace/eslint-config`, and `@workspace/typescript-config`. Type-safe full-stack: backend imports a contract from `@workspace/shared`; web has it available via `transpilePackages`.

**Tech Stack:** pnpm 10.33.4 · Turborepo ^2.9 · Next.js 16.2.6 (App Router/Turbopack/RSC) · React 19.2.4 · Fastify · tsx + tsup · TypeScript ^5 · Tailwind v4 · Base UI + shadcn (`base-nova`) · next-themes · Phosphor icons.

> **Note on methodology:** This is a scaffolding/assembly task, not feature development, so classic TDD (failing test → impl) does not apply. The verification gate for every task is the toolchain: `pnpm install`, `pnpm build`, `pnpm lint`, `pnpm typecheck`, and a live `GET /health` smoke test. Each task ends with a commit.

**Source repo:** `/Users/gabe/www/personal/camps.dev` (referred to below as `$SRC`).
**Destination:** `/Users/gabe/www/personal/zenx` (referred to below as `$DEST`).

> Throughout, run commands from `$DEST` unless stated otherwise. Do **not** copy `node_modules`, `.next`, `.turbo`, `dist`, `.git`, or `.DS_Store` from the source.

---

## File Structure

```
zenx/
├── apps/
│   ├── web/
│   │   ├── app/{layout.tsx, page.tsx, favicon.ico}
│   │   ├── components/{theme-provider.tsx, theme-toggle.tsx}
│   │   ├── {next.config.ts, tsconfig.json, eslint.config.js, postcss.config.mjs, components.json, package.json}
│   │   └── CLAUDE.md
│   └── backend/
│       ├── src/{index.ts, app.ts, routes/health.ts}
│       ├── {tsconfig.json, tsup.config.ts, eslint.config.js, package.json}
│       └── CLAUDE.md
├── packages/
│   ├── ui/            (copied intact) + CLAUDE.md
│   ├── shared/
│   │   ├── src/index.ts
│   │   ├── {package.json, tsconfig.json, eslint.config.js}
│   │   └── CLAUDE.md
│   ├── eslint-config/ (copied intact) + CLAUDE.md
│   └── typescript-config/ (copied intact) + node.json + CLAUDE.md
├── turbo.json · pnpm-workspace.yaml · tsconfig.json
├── CLAUDE.md · README.md · AGENTS.md
└── .gitignore · .prettierrc · .prettierignore · .eslintrc.js · .npmrc
```

---

## Task 1: Scaffold directory + copy intact packages and root configs

**Files:**
- Create: `$DEST/` tree
- Copy: `packages/ui`, `packages/eslint-config`, `packages/typescript-config`, `pnpm-workspace.yaml`, `turbo.json`, `tsconfig.json`, dotfiles, `AGENTS.md`

- [ ] **Step 1: Create destination skeleton**

```bash
mkdir -p /Users/gabe/www/personal/zenx/apps /Users/gabe/www/personal/zenx/packages
```

- [ ] **Step 2: Copy the three intact packages (no node_modules/.turbo/dist)**

```bash
cd /Users/gabe/www/personal
for p in ui eslint-config typescript-config; do
  rsync -a --exclude 'node_modules' --exclude '.turbo' --exclude 'dist' \
    camps.dev/packages/$p/ zenx/packages/$p/
done
```

- [ ] **Step 3: Copy root config files and dotfiles**

```bash
cd /Users/gabe/www/personal/camps.dev
rsync -a pnpm-workspace.yaml turbo.json tsconfig.json AGENTS.md \
  .gitignore .prettierrc .prettierignore .eslintrc.js .npmrc \
  /Users/gabe/www/personal/zenx/
```

- [ ] **Step 4: Remove any stray macOS/build cruft that slipped in**

```bash
cd /Users/gabe/www/personal/zenx
find . -name '.DS_Store' -delete
rm -rf packages/*/.turbo packages/*/dist
```

- [ ] **Step 5: Verify the copied tree**

Run: `cd /Users/gabe/www/personal/zenx && find packages -maxdepth 2 -type d | sort && ls -a`
Expected: `packages/ui`, `packages/eslint-config`, `packages/typescript-config` present; root shows `turbo.json`, `pnpm-workspace.yaml`, `tsconfig.json`, `AGENTS.md`, and the five dotfiles. No `node_modules`.

- [ ] **Step 6: Commit deferred** — git is not initialized yet. Initialization + first commit happen in Task 10. Continue to Task 2.

---

## Task 2: Root `package.json`

**Files:**
- Create: `$DEST/package.json`

- [ ] **Step 1: Write the root package.json (renamed to `zenx`)**

```json
{
  "name": "zenx",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "lint": "turbo lint",
    "format": "turbo format",
    "typecheck": "turbo typecheck"
  },
  "devDependencies": {
    "@workspace/eslint-config": "workspace:*",
    "@workspace/typescript-config": "workspace:*",
    "prettier": "^3.8.3",
    "prettier-plugin-tailwindcss": "^0.8.0",
    "turbo": "^2.9.15",
    "typescript": "^5"
  },
  "packageManager": "pnpm@10.33.4",
  "engines": {
    "node": ">=20"
  }
}
```

- [ ] **Step 2: Verify**

Run: `cd /Users/gabe/www/personal/zenx && node -e "console.log(require('./package.json').name)"`
Expected: `zenx`

---

## Task 3: Add `node.json` TypeScript preset + extend turbo outputs

**Files:**
- Create: `$DEST/packages/typescript-config/node.json`
- Modify: `$DEST/turbo.json`

- [ ] **Step 1: Write `packages/typescript-config/node.json`**

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "display": "Node",
  "extends": "./base.json",
  "compilerOptions": {
    "lib": ["ES2022"],
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "noEmit": false,
    "outDir": "dist"
  }
}
```

- [ ] **Step 2: Update `turbo.json` build outputs to include `dist/**`**

Replace the `build` task block so its `outputs` array reads:

```json
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
```

- [ ] **Step 3: Verify JSON validity**

Run: `cd /Users/gabe/www/personal/zenx && node -e "require('./turbo.json'); require('./packages/typescript-config/node.json'); console.log('ok')"`
Expected: `ok`

---

## Task 4: `@workspace/shared` package

**Files:**
- Create: `$DEST/packages/shared/package.json`
- Create: `$DEST/packages/shared/tsconfig.json`
- Create: `$DEST/packages/shared/eslint.config.js`
- Create: `$DEST/packages/shared/src/index.ts`

- [ ] **Step 1: Write `packages/shared/package.json`**

Ships TS source (mirrors `@workspace/ui`); consumers transpile/bundle it.

```json
{
  "name": "@workspace/shared",
  "version": "0.0.0",
  "type": "module",
  "private": true,
  "scripts": {
    "lint": "eslint",
    "format": "prettier --write \"**/*.ts\"",
    "typecheck": "tsc --noEmit"
  },
  "exports": {
    ".": "./src/index.ts"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@workspace/eslint-config": "workspace:*",
    "@workspace/typescript-config": "workspace:*",
    "eslint": "^9",
    "typescript": "^5"
  }
}
```

- [ ] **Step 2: Write `packages/shared/tsconfig.json`**

```json
{
  "extends": "@workspace/typescript-config/base.json",
  "compilerOptions": {
    "noEmit": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 3: Write `packages/shared/eslint.config.js`**

```js
import { config } from "@workspace/eslint-config/base"

/** @type {import("eslint").Linter.Config} */
export default config
```

- [ ] **Step 4: Write `packages/shared/src/index.ts` (example cross-app contract)**

```ts
/**
 * Cross-app contracts shared between `@workspace/web` and `@workspace/backend`.
 * Define API request/response shapes and domain types here so both ends stay
 * in sync. This file is the package's single entry point (see `exports` in
 * package.json).
 */

/** Response shape for the backend's `GET /health` endpoint. */
export interface HealthResponse {
  status: "ok"
  /** ISO-8601 timestamp of when the check ran. */
  timestamp: string
  /** Backend service name. */
  service: string
}
```

- [ ] **Step 5: Verify**

Run: `cd /Users/gabe/www/personal/zenx && node -e "require('./packages/shared/package.json'); console.log('ok')"`
Expected: `ok` (full typecheck runs in Task 8 after install.)

---

## Task 5: `apps/web` — Next.js skeleton (design system wired, nothing built)

**Files:**
- Create: `$DEST/apps/web/app/layout.tsx`
- Create: `$DEST/apps/web/app/page.tsx`
- Copy:   `$DEST/apps/web/app/favicon.ico`
- Create: `$DEST/apps/web/components/theme-provider.tsx`
- Create: `$DEST/apps/web/components/theme-toggle.tsx`
- Create: `$DEST/apps/web/next.config.ts`
- Create: `$DEST/apps/web/tsconfig.json`
- Create: `$DEST/apps/web/eslint.config.js`
- Create: `$DEST/apps/web/postcss.config.mjs`
- Create: `$DEST/apps/web/components.json`
- Create: `$DEST/apps/web/package.json`

- [ ] **Step 1: Create web dirs and copy the favicon**

```bash
mkdir -p /Users/gabe/www/personal/zenx/apps/web/app /Users/gabe/www/personal/zenx/apps/web/components
cp /Users/gabe/www/personal/camps.dev/apps/portfolio/app/favicon.ico \
   /Users/gabe/www/personal/zenx/apps/web/app/favicon.ico
```

- [ ] **Step 2: Write `apps/web/package.json` (renamed `web`, blog deps dropped, `@workspace/shared` added)**

```json
{
  "name": "web",
  "version": "0.0.1",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "format": "prettier --write \"**/*.{ts,tsx}\"",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@phosphor-icons/react": "^2.1.10",
    "@workspace/shared": "workspace:*",
    "@workspace/ui": "workspace:*",
    "next": "16.2.6",
    "next-themes": "^0.4.6",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@workspace/eslint-config": "workspace:^",
    "@workspace/typescript-config": "workspace:*",
    "eslint": "^9",
    "typescript": "^5"
  }
}
```

- [ ] **Step 3: Write `apps/web/next.config.ts` (add `@workspace/shared` to transpilePackages; keep SVG image config)**

```ts
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui", "@workspace/shared"],
  images: {
    // Allow first-party SVG art through the image optimizer, sandboxed.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}

export default nextConfig
```

- [ ] **Step 4: Write `apps/web/tsconfig.json`**

```json
{
  "extends": "@workspace/typescript-config/nextjs.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@workspace/ui/*": ["../../packages/ui/src/*"]
    },
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": [
    "next-env.d.ts",
    "next.config.ts",
    "**/*.ts",
    "**/*.tsx",
    "**/*.mts",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 5: Write `apps/web/eslint.config.js`**

```js
import { nextJsConfig } from "@workspace/eslint-config/next-js"

/** @type {import("eslint").Linter.Config} */
export default nextJsConfig
```

- [ ] **Step 6: Write `apps/web/postcss.config.mjs`**

```js
export { default } from "@workspace/ui/postcss.config"
```

- [ ] **Step 7: Write `apps/web/components.json`**

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "base-nova",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "../../packages/ui/src/styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "iconLibrary": "phosphor",
  "aliases": {
    "components": "@/components",
    "hooks": "@/hooks",
    "lib": "@/lib",
    "utils": "@workspace/ui/lib/utils",
    "ui": "@workspace/ui/components"
  },
  "rtl": true,
  "menuColor": "default",
  "menuAccent": "subtle"
}
```

- [ ] **Step 8: Write `apps/web/components/theme-provider.tsx` (verbatim from source)**

```tsx
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}

export { ThemeProvider }
```

- [ ] **Step 9: Write `apps/web/components/theme-toggle.tsx` (verbatim from source)**

```tsx
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
```

- [ ] **Step 10: Write `apps/web/app/layout.tsx` (fonts + theme + globals; cleaned formatting)**

```tsx
import { Geist_Mono, Inter, Figtree } from "next/font/google"

import { cn } from "@workspace/ui/lib/utils"
import "@workspace/ui/globals.css"

import { ThemeProvider } from "@/components/theme-provider"

const fontHeading = Figtree({ subsets: ["latin"], variable: "--font-heading" })
const fontSans = Inter({ subsets: ["latin"], variable: "--font-sans" })
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased font-sans",
        fontHeading.variable,
        fontSans.variable,
        fontMono.variable
      )}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 11: Write `apps/web/app/page.tsx` (blank placeholder)**

```tsx
import { ThemeToggle } from "@/components/theme-toggle"

export default function Page() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4">
      <h1 className="font-heading text-3xl font-bold tracking-tight">zenx</h1>
      <p className="text-sm text-muted-foreground">
        Monorepo boilerplate. Start building.
      </p>
      <ThemeToggle />
    </main>
  )
}
```

- [ ] **Step 12: Verify the web app tree**

Run: `cd /Users/gabe/www/personal/zenx/apps/web && find . -type f -not -name favicon.ico | sort`
Expected: exactly the 11 files listed under **Files** above (minus favicon, which is binary). No `sections/`, `navbar`, `lib/`, `content/`, `blog/`, or `article/`.

---

## Task 6: `apps/backend` — Fastify app

**Files:**
- Create: `$DEST/apps/backend/package.json`
- Create: `$DEST/apps/backend/tsconfig.json`
- Create: `$DEST/apps/backend/tsup.config.ts`
- Create: `$DEST/apps/backend/eslint.config.js`
- Create: `$DEST/apps/backend/src/app.ts`
- Create: `$DEST/apps/backend/src/index.ts`
- Create: `$DEST/apps/backend/src/routes/health.ts`

- [ ] **Step 1: Create backend dirs**

```bash
mkdir -p /Users/gabe/www/personal/zenx/apps/backend/src/routes
```

- [ ] **Step 2: Write `apps/backend/package.json`**

```json
{
  "name": "backend",
  "version": "0.0.1",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsup",
    "start": "node dist/index.js",
    "lint": "eslint",
    "format": "prettier --write \"src/**/*.ts\"",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@workspace/shared": "workspace:*",
    "fastify": "^5.2.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@workspace/eslint-config": "workspace:*",
    "@workspace/typescript-config": "workspace:*",
    "eslint": "^9",
    "tsup": "^8.5.0",
    "tsx": "^4.20.0",
    "typescript": "^5"
  }
}
```

- [ ] **Step 3: Write `apps/backend/tsconfig.json`**

```json
{
  "extends": "@workspace/typescript-config/node.json",
  "compilerOptions": {
    "noEmit": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

> `tsc` is used only for `typecheck` (`--noEmit`); `tsup` produces the build output. Hence `noEmit: true` here even though `node.json` enables emit for the general case.

- [ ] **Step 4: Write `apps/backend/tsup.config.ts` (bundle workspace deps so shared TS source resolves at runtime)**

```ts
import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node20",
  outDir: "dist",
  clean: true,
  // Bundle workspace packages (e.g. @workspace/shared ships TS source) into the
  // output so `node dist/index.js` has no unresolved internal imports.
  noExternal: [/^@workspace\//],
})
```

- [ ] **Step 5: Write `apps/backend/eslint.config.js`**

```js
import { config } from "@workspace/eslint-config/base"

/** @type {import("eslint").Linter.Config} */
export default config
```

- [ ] **Step 6: Write `apps/backend/src/routes/health.ts`**

```ts
import type { FastifyInstance } from "fastify"

import type { HealthResponse } from "@workspace/shared"

/** Registers `GET /health`, returning a typed {@link HealthResponse}. */
export async function healthRoutes(app: FastifyInstance): Promise<void> {
  app.get("/health", async (): Promise<HealthResponse> => {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "backend",
    }
  })
}
```

- [ ] **Step 7: Write `apps/backend/src/app.ts` (buildApp factory)**

```ts
import Fastify, { type FastifyInstance } from "fastify"

import { healthRoutes } from "./routes/health.js"

/**
 * Builds and configures a Fastify instance without starting it. Keeping wiring
 * here (separate from `listen`) makes the app importable for tests and scripts.
 */
export function buildApp(): FastifyInstance {
  const app = Fastify({ logger: true })

  app.register(healthRoutes)

  return app
}
```

- [ ] **Step 8: Write `apps/backend/src/index.ts` (boot + listen)**

```ts
import { buildApp } from "./app.js"

const PORT = Number(process.env.PORT ?? 3001)
const HOST = process.env.HOST ?? "0.0.0.0"

const app = buildApp()

app.listen({ port: PORT, host: HOST }).catch((err) => {
  app.log.error(err)
  process.exit(1)
})
```

> Imports use `.js` extensions because `node.json` sets `module: NodeNext` (NodeNext requires explicit extensions on relative ESM imports; TypeScript resolves the `.js` back to the `.ts` source).

- [ ] **Step 9: Verify the backend tree**

Run: `cd /Users/gabe/www/personal/zenx/apps/backend && find . -type f | sort`
Expected: `./eslint.config.js`, `./package.json`, `./src/app.ts`, `./src/index.ts`, `./src/routes/health.ts`, `./tsconfig.json`, `./tsup.config.ts`.

---

## Task 7: Root `README.md`

**Files:**
- Create: `$DEST/README.md`

- [ ] **Step 1: Write a generic README**

```markdown
# zenx

A full-stack TypeScript monorepo boilerplate — pnpm + Turborepo, a Next.js
frontend, a Fastify backend, and a shared design system.

## Layout

- `apps/web` — Next.js 16 app (App Router, RSC, Turbopack). Design system and
  theming wired in; nothing built yet.
- `apps/backend` — Fastify API. `buildApp()` factory + `GET /health`.
- `packages/ui` — `@workspace/ui`: shadcn (`base-nova`) on Base UI, Tailwind v4
  design tokens, and the blueprint-frame layout primitives.
- `packages/shared` — `@workspace/shared`: cross-app types/contracts.
- `packages/eslint-config`, `packages/typescript-config` — shared presets.

## Commands

Run from the repo root (Turbo fans out to workspaces):

\`\`\`bash
pnpm dev         # web on :3000, backend on :3001
pnpm build       # build all workspaces
pnpm lint        # lint all workspaces
pnpm format      # prettier --write
pnpm typecheck   # tsc --noEmit
\`\`\`

## Adding UI components

shadcn components land in the `ui` package, not the apps:

\`\`\`bash
pnpm dlx shadcn@latest add button -c apps/web
\`\`\`

\`\`\`tsx
import { Button } from "@workspace/ui/components/button"
\`\`\`

See `CLAUDE.md` (root and per-workspace) for architecture details.
```

- [ ] **Step 2: Verify**

Run: `head -1 /Users/gabe/www/personal/zenx/README.md`
Expected: `# zenx`

---

## Task 8: Install + full verification

**Files:** none (verification only)

- [ ] **Step 1: Install dependencies**

Run: `cd /Users/gabe/www/personal/zenx && pnpm install`
Expected: completes without errors; resolves `fastify`, `tsx`, `tsup` and links the four `@workspace/*` packages.

- [ ] **Step 2: Typecheck all workspaces**

Run: `cd /Users/gabe/www/personal/zenx && pnpm typecheck`
Expected: PASS for `web`, `backend`, `shared`, `ui`.

- [ ] **Step 3: Lint all workspaces**

Run: `cd /Users/gabe/www/personal/zenx && pnpm lint`
Expected: no errors (warnings allowed — `eslint-plugin-only-warn` downgrades all rules to warn).

- [ ] **Step 4: Build all workspaces**

Run: `cd /Users/gabe/www/personal/zenx && pnpm build`
Expected: `web` produces `.next/`, `backend` produces `dist/index.js`, no errors.

- [ ] **Step 5: Smoke-test the backend `/health` route**

```bash
cd /Users/gabe/www/personal/zenx
node apps/backend/dist/index.js &
SERVER_PID=$!
sleep 1
curl -s http://localhost:3001/health
kill $SERVER_PID
```

Expected: JSON like `{"status":"ok","timestamp":"...","service":"backend"}`.

- [ ] **Step 6: Fix-and-recheck loop**

If any step fails, fix the offending file and re-run that step. Do not proceed to Task 9 until Steps 1–5 all pass.

---

## Task 9: `CLAUDE.md` — root + per workspace

**Files:**
- Create: `$DEST/CLAUDE.md`
- Create: `$DEST/apps/web/CLAUDE.md`
- Create: `$DEST/apps/backend/CLAUDE.md`
- Create: `$DEST/packages/ui/CLAUDE.md`
- Create: `$DEST/packages/shared/CLAUDE.md`
- Create: `$DEST/packages/eslint-config/CLAUDE.md`
- Create: `$DEST/packages/typescript-config/CLAUDE.md`

- [ ] **Step 1: Write root `CLAUDE.md`**

```markdown
# zenx

A full-stack TypeScript monorepo boilerplate, built as a pnpm + Turborepo
workspace with a shared design system and shared type contracts.

## Architecture

\`\`\`
zenx/
├── apps/
│   ├── web/        # Next.js 16 frontend (App Router, RSC, Turbopack)
│   └── backend/    # Fastify API
├── packages/
│   ├── ui/                 # @workspace/ui — design system + blueprint-frame primitives
│   ├── shared/             # @workspace/shared — cross-app types/contracts
│   ├── eslint-config/      # @workspace/eslint-config
│   └── typescript-config/  # @workspace/typescript-config
├── turbo.json              # task pipeline (build, lint, format, typecheck, dev)
└── pnpm-workspace.yaml
\`\`\`

Workspaces are `apps/*` and `packages/*`. Internal packages are referenced via
`workspace:*` under the `@workspace/*` scope.

**Why this shape:** the frontend and backend are deployable independently but
share a single source of truth for API contracts via `@workspace/shared`. The
design system lives in `@workspace/ui` so it can be reused across any number of
frontends. Config is centralized in `eslint-config`/`typescript-config` so every
workspace lints and compiles the same way.

**Type flow:** `@workspace/shared` defines contracts (e.g. `HealthResponse`).
`apps/backend` imports them to shape responses; `apps/web` has the package in its
`transpilePackages`, so client fetches can import the same types for end-to-end
type safety. Turbo's `^build` ordering builds dependencies before dependents.

## Tech stack

| Concern         | Choice |
| --------------- | ------ |
| Package manager | pnpm `10.33.4` (Node `>=20`) |
| Monorepo        | Turborepo `^2.9` |
| Frontend        | Next.js `16.2.6` (App Router, Turbopack, RSC) + React `19.2.4` |
| Backend         | Fastify `^5` (tsx dev, tsup build) |
| Language        | TypeScript `^5` |
| Styling         | Tailwind CSS v4 (CSS-first) |
| Components      | shadcn (`base-nova`) on Base UI (not Radix) |
| Icons           | Phosphor |
| Theming         | next-themes (class strategy, default `light`) |
| Formatting      | Prettier + `prettier-plugin-tailwindcss` |

## Commands

\`\`\`bash
pnpm dev         # web :3000, backend :3001 (persistent, uncached)
pnpm build       # turbo build (web → .next, backend → dist)
pnpm lint        # turbo lint
pnpm format      # turbo format (prettier --write)
pnpm typecheck   # turbo typecheck (tsc --noEmit)
\`\`\`

## Conventions

- **Imports:** group external → `@workspace/*` → `@/*`, blank line between groups.
- **Exports:** function declarations with a named export at the bottom
  (`export { Foo }`), not `export default` (except Next.js route/layout files,
  which require default exports).
- **Components:** default to Server Components; add `"use client"` only when
  needed. For icons in server components import from
  `@phosphor-icons/react/dist/ssr`.
- **Base UI (not Radix):** polymorphism uses the `render` prop, not `asChild`.
- **Styling:** compose classes with `cn(...)`; reference semantic token
  utilities (`bg-primary`, `text-muted-foreground`, `border-border`).

## Commit messages

Conventional Commits: `type(scope): summary` where type ∈ {chore, docs, feat,
fix, refactor, style, test} and scope is the area (`web`, `backend`, `ui`,
`shared`, `deps`). Present tense, focused on the *what*.
```

- [ ] **Step 2: Write `apps/web/CLAUDE.md`**

```markdown
# apps/web

Next.js 16 frontend (App Router, RSC, Turbopack). The design system and theming
are wired in; the app itself is a blank slate.

## Structure

\`\`\`
app/
├── layout.tsx   # Root layout: fonts (Figtree/Inter/Geist Mono) + ThemeProvider + globals.css
└── page.tsx     # Blank placeholder home page
components/
├── theme-provider.tsx   # next-themes wrapper ("use client")
└── theme-toggle.tsx     # sun/moon toggle, class-driven (no hydration flash)
\`\`\`

## Wiring

- `next.config.ts` sets `transpilePackages: ["@workspace/ui", "@workspace/shared"]`
  so workspace TS source compiles in the app.
- Tailwind v4 is configured entirely in `@workspace/ui` — `postcss.config.mjs`
  re-exports `@workspace/ui/postcss.config`, and `app/layout.tsx` imports
  `@workspace/ui/globals.css` (the single source of design tokens).
- Path aliases: `@/*` → app root, `@workspace/ui/*` → `packages/ui/src/*`.

## Conventions

- Default to Server Components; `"use client"` only when needed.
- Consume the design system via subpath imports:
  `import { Button } from "@workspace/ui/components/button"`.
  The blueprint-frame primitives (`Frame`, `FrameDivider`, `Crosshair`) live in
  `@workspace/ui` — see `packages/ui/CLAUDE.md` for composition rules.
- Consume shared contracts via `import type { HealthResponse } from "@workspace/shared"`.
- New shadcn components land in **`packages/ui`**, not here:
  `pnpm dlx shadcn@latest add <name> -c apps/web`.
- Base UI polymorphism uses the `render` prop, not `asChild`.
```

- [ ] **Step 3: Write `apps/backend/CLAUDE.md`**

```markdown
# apps/backend

Fastify API server.

## Structure

\`\`\`
src/
├── index.ts          # Boot: build the app and listen (PORT env, default 3001)
├── app.ts            # buildApp() — configures a Fastify instance without listening
└── routes/
    └── health.ts     # GET /health → typed HealthResponse from @workspace/shared
\`\`\`

The `buildApp()` factory is separate from `listen()` so the app can be imported
by tests and scripts. Register new route modules inside `buildApp()`.

## Tooling

- **dev:** `tsx watch src/index.ts` — runs TS directly with watch reload.
- **build:** `tsup` (see `tsup.config.ts`) — bundles to `dist/` as ESM,
  `target: node20`, with `noExternal: [/^@workspace\//]` so workspace packages
  that ship TS source (e.g. `@workspace/shared`) are bundled in.
- **start:** `node dist/index.js`.
- **typecheck:** `tsc --noEmit` against `@workspace/typescript-config/node.json`.

## Conventions

- `tsconfig` extends `@workspace/typescript-config/node.json` (`module: NodeNext`).
  Relative ESM imports therefore need explicit `.js` extensions (TypeScript maps
  them back to the `.ts` source) — e.g. `import { buildApp } from "./app.js"`.
- ESLint uses `@workspace/eslint-config/base`.
- Shape responses with types from `@workspace/shared` so the contract stays in
  sync with the frontend.
```

- [ ] **Step 4: Write `packages/ui/CLAUDE.md`**

```markdown
# packages/ui — @workspace/ui

The shared design system: shadcn (`base-nova` style) on Base UI primitives, with
Tailwind v4 design tokens and the blueprint-frame layout primitives.

## Layout

- `src/components/` — ~60 shadcn/Base-UI components, plus custom layout
  primitives `frame.tsx` (`Frame` + `FrameDivider`) and `crosshair.tsx`
  (`Crosshair`).
- `src/lib/utils.ts` — the `cn()` helper (clsx + tailwind-merge).
- `src/hooks/` — shared hooks.
- `src/styles/globals.css` — single source of truth for Tailwind v4 setup and
  all design tokens (OKLCH; light under `:root`, dark under `.dark`). Also
  defines `animate-marquee`.

## Exports & usage

Subpath-based (see `package.json`):

\`\`\`ts
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import "@workspace/ui/globals.css"
\`\`\`

The package ships **TS source**; consumers compile it (Next.js
`transpilePackages` + Turbopack). `tsconfig.json` uses `module: ESNext` /
`moduleResolution: Bundler` for that reason.

## shadcn

Configured per consuming app in its `components.json` (`style: base-nova`,
`baseColor: neutral`, `iconLibrary: phosphor`, `ui` alias → `@workspace/ui/components`).
New components are added with `-c apps/<app>` and land here.

## Blueprint-frame layout

A centered content column bounded by vertical guide **rails**, with crosshair
`+` marks at line intersections. Three primitives:

- **`Crosshair`** — a positioned `+` mark (`position`: `top-left` | `top-right`
  | `bottom-left` | `bottom-right`), centered on that corner of its parent.
- **`Frame`** — a full-bleed region drawing the vertical rails as a centered
  overlay at `--frame-width` (set via `[--frame-width:1440px]`). Content inside
  gets rails; content outside stays full-bleed.
- **`FrameDivider`** — a full-width horizontal rule with crosshairs where the
  rails cross it. Place between framed sections.

Rules of thumb: the content column width (`--frame-width`) and any
`max-w-[...]` container must agree. Section-boundary dividers are full-bleed
(`FrameDivider`); dividers inside a section are column-width (`border-t`). A
section opts out of the frame by living outside `<Frame>`. Lines use
`border-border`; crosshairs use `text-muted-foreground/40`.
```

- [ ] **Step 5: Write `packages/shared/CLAUDE.md`**

```markdown
# packages/shared — @workspace/shared

Cross-app type contracts shared between `apps/web` and `apps/backend`.

## What belongs here

- API request/response shapes (e.g. `HealthResponse`).
- Domain types and enums used by both the frontend and backend.

What does **not** belong here: runtime code with heavy dependencies, framework-
specific types (React/Fastify), or anything only one app uses.

## Exports & usage

Single entry point, ships TS source (like `@workspace/ui`):

\`\`\`ts
import type { HealthResponse } from "@workspace/shared"
\`\`\`

- Backend imports these to shape responses (used now).
- Web lists it as a dependency and has it in `transpilePackages` (available for
  client fetches).

Because it ships source, consumers transpile/bundle it: Next.js via
`transpilePackages`, the Fastify backend via tsup's `noExternal: [/^@workspace\//]`.
Add new contracts to `src/index.ts`.
```

- [ ] **Step 6: Write `packages/eslint-config/CLAUDE.md`**

```markdown
# packages/eslint-config — @workspace/eslint-config

Shared flat ESLint configs. All rules are downgraded to warnings via
`eslint-plugin-only-warn` (lint never blocks; fix warnings before commit).

## Exports

- `@workspace/eslint-config/base` — `base.js`. JS + TypeScript recommended +
  Prettier + Turbo plugin. Use for non-React packages (`shared`, `backend`).
- `@workspace/eslint-config/next-js` — `next.js`. Base + React + Next.js rules.
  Use for the Next.js app (`web`).
- `@workspace/eslint-config/react-internal` — `react-internal.js`. Base + React
  rules for internal React libraries (`ui`).

Each workspace's `eslint.config.js` re-exports the matching preset.
```

- [ ] **Step 7: Write `packages/typescript-config/CLAUDE.md`**

```markdown
# packages/typescript-config — @workspace/typescript-config

Shared `tsconfig` presets. Extend the one that matches the workspace.

## Presets

- `base.json` — strict defaults (`strict`, `noUncheckedIndexedAccess`,
  `isolatedModules`, `module: NodeNext`, `target/lib ES2022`). The common base.
- `nextjs.json` — extends base; `module: ESNext`, `moduleResolution: Bundler`,
  `jsx: preserve`, `noEmit`, Next plugin. For the Next.js app (`web`).
- `react-library.json` — extends base; `jsx: react-jsx`. For internal React
  libraries (`ui`, which overrides to Bundler resolution for source shipping).
- `node.json` — extends base; `lib: ["ES2022"]` (no DOM), emit on with
  `outDir: dist`. For the Node backend (`backend` typechecks with `noEmit`).

Each workspace `tsconfig.json` sets `extends` to the matching preset and adds
only its own `paths`/`include`.
```

- [ ] **Step 8: Verify all CLAUDE.md files exist**

Run: `cd /Users/gabe/www/personal/zenx && find . -name CLAUDE.md -not -path '*/node_modules/*' | sort`
Expected: 7 paths — root, `apps/web`, `apps/backend`, `packages/ui`, `packages/shared`, `packages/eslint-config`, `packages/typescript-config`.

---

## Task 10: Initialize git + initial commit

**Files:** none (git + final verification)

- [ ] **Step 1: Confirm no portfolio content leaked in**

Run: `cd /Users/gabe/www/personal/zenx && grep -ri "portfolio\|camps.dev\|adviso\|zimo" --include='*.ts' --include='*.tsx' --include='*.json' --include='*.md' . | grep -v node_modules || echo "CLEAN"`
Expected: `CLEAN` (no matches). If matches appear, remove them before committing.

- [ ] **Step 2: Initialize git**

```bash
cd /Users/gabe/www/personal/zenx && git init -q && git branch -M main
```

- [ ] **Step 3: Stage and verify what will be committed (node_modules/.next/dist excluded by .gitignore)**

Run: `cd /Users/gabe/www/personal/zenx && git add -A && git status --short | grep -E "node_modules|\.next/|/dist/" || echo "no build artifacts staged"`
Expected: `no build artifacts staged`.

- [ ] **Step 4: Commit**

```bash
cd /Users/gabe/www/personal/zenx
git commit -q -m "chore: scaffold zenx full-stack monorepo boilerplate"
echo committed
```

Expected: `committed`.

- [ ] **Step 5: Final sanity build from a clean state**

Run: `cd /Users/gabe/www/personal/zenx && pnpm build`
Expected: all workspaces build with no errors. Boilerplate is ready.

---

## Done

`zenx` is a clean full-stack monorepo: `@workspace/ui` design system intact, a
blank Next.js `web` app, a Fastify `backend` with a typed `/health` route, a
`@workspace/shared` contracts package, centralized config, and a `CLAUDE.md` at
the root and in every workspace.
```
