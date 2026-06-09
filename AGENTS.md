# AGENTS.md — Bimbel One Platform

## Project Identity

Next.js 16 (App Router) + React 19 + TypeScript 5.7.  
Tailwind CSS v4 via `@tailwindcss/postcss`.  
Path alias: `@/` → `src/` (configured in tsconfig.json and vitest.config.ts).

## Quick Start

```bash
cp .env.example .env.local   # edit SESSION_SECRET, DATABASE_URL
npm install
npm run dev                   # http://localhost:3000
```

## Essential Commands (run in this order for pre-commit)

```bash
npm run typecheck             # tsc --noEmit
npm run lint                  # eslint .
npm test                      # vitest run
npm run build                 # next build (standalone output)
```

- **Single test file**: `npx vitest run src/server/__tests__/auth.test.ts`
- **Single test by name**: `npx vitest run -t "finds user by email"`
- **E2E**: `npx playwright test` (1 worker, 1 retry, auto-starts dev server)
- **Database**: `npm run migrate` then `npm run seed` (requires Postgres running)

## Testing

- Vitest with `environment: 'node'` (no jsdom for server code)
- Globals enabled — `describe`/`it`/`expect`/`vi` available without imports
- Tests co-located in `__tests__/` next to source
- Rate limiter tests use `vi.useFakeTimers()` + `__resetRateLimiter()` internal helpers
- E2E in `tests/e2e/` via Playwright + `@axe-core/playwright` for a11y
- Setup file: `vitest.setup.ts` imports `@testing-library/jest-dom/vitest`

## Architecture

- `src/server/` — pure server business logic (no React imports)
- `src/lib/` — utilities, validation (Zod 4), Zustand stores, DB connection
- `src/components/panels/` — 16 screen panels, switched by `kind` in `screens.ts`
- `src/app/api/v1/` — REST API endpoints (7 routes, all `route.ts`)
- API envelope: `ok(data)` / `fail(message, code?, details?)` from `src/server/api.ts`
- Current data layer: **in-memory stores** (`catalog.ts`, `data-store.ts`, `audit-store.ts`). Data lost on restart. Postgres migration/seed scripts exist for production.
- Auth: Session-based, HMAC-SHA256 signed cookie (`s1_{base64url}`), scrypt passwords, optional TOTP MFA
- RBAC: `resource:action` permission keys (e.g. `students:manage`)
- Middleware (`src/middleware.ts`) validates session cookie format, redirects to `/login` with `?redirect=` param

## Key Config Files

| File | Purpose |
|------|---------|
| `next.config.ts` | Standalone output, CSP/Security headers, Sentry integration |
| `vitest.config.ts` | Path alias, node env, setup file |
| `eslint.config.mjs` | Flat config, `eslint-config-next/core-web-vitals`, ignores `node_modules`/`.next`/`.kilo`/`out`/`build` |
| `sentry.{client,server,edge}.config.ts` | Sentry DSN from env |

## CI Pipeline (`.github/workflows/ci.yml`)

On push/PR to `main`: `npm ci` → `tsc --noEmit` → `eslint .` → `vitest run --coverage (≥80%)` → `next build`

## Demos & First Login

Default users seeded in `catalog.ts`:
- `admin@bimbel.one` / `Admin123!` (super_admin, MFA enabled)
- `ayu@bimbel.one` / `Tutor123!` (tutor, no MFA — best for quick testing)

Passwords overridable via `DEMO_*_PASSWORD` env vars.

## Gotchas

- `SESSION_SECRET` must be set in `.env.local` or dev falls back to `'dev-secret-do-not-use-in-production'`
- `DATABASE_URL` required for `npm run migrate`/`seed` but **not** for dev (in-memory stores)
- **No git hooks** — pre-commit checks are manual
- ESLint config uses `eslint-config-next/core-web-vitals`, no Prettier/formatting configured
- CSP headers are strict (no `unsafe-eval` for scripts except in dev); Sentry source maps may need adjustment
- `output: 'standalone'` in Next config — build output is self-contained for Docker
