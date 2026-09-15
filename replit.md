# CampusOS

CampusOS is a student support dashboard that connects wellbeing, finances, and academic workload into actionable signals.

## Run & Operate

- `pnpm run dev` — start the full local stack (API on :5000 + web on :5173 via a single script)
- `pnpm run dev:api` — run just the API server (port 5000)
- `pnpm run dev:web` — run just the frontend (port 5173, proxies `/api` → localhost:5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

Local env defaults: API server reads `PORT` (default 5000); the web server reads
`PORT` (default 5173), `BASE_PATH` (default `/`), and `API_PROXY_TARGET`
(default `http://localhost:5000`). The demo runs entirely on in-memory seeded
data, so no database is required to boot the app locally. To use the DB layer,
set `DATABASE_URL` in a local `.env` (git-ignored).

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/campusos/src/App.tsx` — responsive dashboard UI and pillar routes
- `artifacts/campusos/src/index.css` — CampusOS visual theme and motion utilities
- `artifacts/api-server/src/routes/campusos.ts` — seeded demo data, CRUD inputs, signal rules, and supportive chat
- `lib/api-spec/openapi.yaml` — source of truth for generated API clients and validation schemas

## Architecture decisions
- The first build uses a seeded in-memory demo profile so the hackathon pitch always has live signals without a migration or empty-state risk.
- API contracts remain OpenAPI-first and frontend calls use generated React Query hooks.
- The signal engine is rule-based and intentionally explainable; each signal names the cross-domain inputs that triggered it.
- The chat route includes a deterministic crisis escalation path before any supportive response is returned.

## Product

The dashboard gives one student a Today overview plus Mind, Money, and Grind spaces. It supports mood check-ins, supportive chat, finance events, assignments, workload context, and a cross-domain Signals feed.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Seeded records reset when the API workflow restarts; this is deliberate for a predictable demo.
- Re-run `pnpm --filter @workspace/api-spec run codegen` after changing the OpenAPI contract.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
