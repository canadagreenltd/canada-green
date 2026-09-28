# AGENTS.md — Canada Green

Guidance for AI coding agents working in this repository.

## What this project is

**Canada Green** is a crowdfunding platform for **EV charging** and **agriculture** investment projects in Canada. Investors browse projects, (eventually) sign up, invest, and track payments; admins manage projects, payments, and users.

Deploy target: **Vercel**.

## Current status (as of production readiness)

| Area | Status |
|------|--------|
| Public marketing site | **Done** — mock projects / FAQ / testimonials |
| Legal stubs (`/terms`, `/privacy`, `/risk-disclosure`) | Placeholder notices only — counsel copy required |
| Auth (login / signup / forgot / reset) | **Live** via Supabase Auth + `/auth/callback` |
| User dashboard (overview, billing, team) | **Live** against Supabase |
| Admin (overview, approvals, support, audit logs) | **Live** against Supabase |
| Payments + receipts Server Actions | **Live** (`src/actions/payments.ts`) |
| Admin project CRUD / DB-backed projects | **Not built** (legacy routes redirect) |
| Route protection / roles | **Live** in middleware (`/dashboard`, `/admin`) |
| Contact / newsletter / socials | Frontend-only / coming soon — email `hello@canadagreen.ca` |

**Mental model:** public marketing stays mock-backed until project CRUD ships; Auth, billing, and admin money flows are production features. Do not invent legal text or social URLs.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui** (`base-nova`, Base UI) + **lucide-react**
- **Supabase** (`@supabase/supabase-js`, `@supabase/ssr`)
- **react-hook-form** + **zod** + shadcn `Field`
- **framer-motion**, **sonner**, **next-themes** (forced light)
- Path alias: `@/*` → `./src/*`
- Dev/build use Turbopack (`npm run dev` / `npm run build`)

## Folder map

```
src/
  app/
    (public)/     → Marketing (no auth) — implemented
    (auth)/       → Login, signup, password reset — live
    (dashboard)/  → Investor dashboard — live
    (admin)/      → Admin panel — live
    api/          → Prefer Server Actions; keep API minimal
  actions/        → Domain Server Actions (payments live; auth/admin/projects stubs unused)
  components/
    ui/           → shadcn primitives
    public/       → Marketing components
    dashboard/    → User dashboard
    admin/        → Admin UI
    shared/       → Logo, ticker, theme, badges, progress, etc.
    auth/         → Auth forms + logout
  lib/
    supabase/     → client, server, middleware helpers
    mock-data/    → projects, faq, testimonials (public marketing)
    validations/  → Zod schemas
    constants.ts  → SECTORS, PAYMENT_STATUSES, ROLES, payment instructions
    profit.ts     → Active-plan profit (Toronto weekdays)
  types/          → Shared types; database.ts placeholder until regenerated
  middleware.ts   → Session refresh + /dashboard + /admin protection
```

Route groups organize layouts; URLs stay flat (`/`, `/login`, `/dashboard`, `/admin`, …).

## Key routes

| Area | Paths |
|------|--------|
| Public | `/`, `/ev`, `/agriculture`, `/projects`, `/projects/[id]`, `/about`, `/how-it-works`, `/impact`, `/faq`, `/contact`, `/terms`, `/privacy`, `/risk-disclosure` |
| Auth | `/login`, `/signup`, `/forgot-password`, `/reset-password` |
| User | `/dashboard`, `/dashboard/billing`, `/dashboard/team` |
| Admin | `/admin`, `/admin/approvals`, `/admin/support`, `/admin/audit-logs` |

## Conventions (follow these)

1. **Prefer Server Actions** in `src/actions/*.ts` over new API routes.
2. **Put pages in the correct route group** — do not invent parallel URL trees.
3. **Component placement**
   - Marketing → `src/components/public/`
   - Dashboard → `src/components/dashboard/`
   - Admin → `src/components/admin/`
   - Cross-cutting → `src/components/shared/`
   - Primitives → `src/components/ui/` (extend shadcn; don’t reinvent)
4. **File names:** kebab-case (`project-card.tsx`, `contact-form.tsx`).
5. **Forms:** RHF + `zodResolver` + Zod schemas in `src/lib/validations/` + shadcn `Field` + Sonner toasts. Match `contact-form.tsx`.
6. **Domain constants** (sectors, payment statuses, roles) live in `src/lib/constants.ts`.
7. **Public data:** until Supabase is wired, use `src/lib/mock-data/`. Keep helpers (`getProjectById`, `getProjectsBySector`, `formatCad`, etc.) consistent across pages.
8. **Images:** use `next/image`. Allowed remotes: Unsplash + `*.supabase.co` (see `next.config.ts`). Run `scripts/check-images.mjs` if changing Unsplash URLs.
9. **Middleware:** session refresh + redirects/role checks in `middleware.ts` / `lib/supabase/middleware.ts`. Protected routes must not stay open in production without Supabase env.
10. **i18n:** FR toggle is intentionally hidden in `utility-bar.tsx`. Do not re-enable without a real i18n plan.
11. **Theme:** light only (`ThemeProvider` with `forcedTheme="light"`). Do not introduce a dark marketing theme.
12. **Env:** never commit secrets. Copy `.env.local.example` → `.env.local`. Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client.

## Design system (preserve)

**Fonts (root layout):** Sora (`font-heading`), Inter (`font-sans`), Caveat (`font-script`).

**Brand tokens** (`globals.css` / Tailwind theme):

- Brand greens: `brand-950` … `brand-50`, primary `#1b4332`
- EV: blue (`ev-500` `#0ea5e9`)
- Agriculture: amber (`agri-500` `#d97706`)
- CTA: `accent-red` `#dc2626`
- Neutrals: cream `#fafaf8`, text `#111827`

**Public UI patterns already in use:**

- Full-bleed `Hero` with gradient overlay
- `SectionHeading`, `Reveal` (scroll fade/slide), `ProjectCard`, `CtaBanner`
- Site chrome: `UtilityBar` + sticky `Navbar` + scroll-away `AnnouncementTicker` + `Footer`
- Sector coloring must stay consistent (EV blue / Agri amber)
- Honest stats only — no fake raised amounts or investor counts on marketing pages
- Primary CTAs use the red pill `Button` variant where the design already does

**Motion:** prefer intentional use of existing patterns (`Reveal`, navbar drawer, progress bar). Respect `prefers-reduced-motion` (ticker already does).

## Environment variables

| Variable | Notes |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Required for live Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server/scripts only |
| `NEXT_PUBLIC_SITE_URL` | e.g. `http://localhost:3000` / production HTTPS |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Required for `db:create-admin` (no script defaults) |

Middleware no-ops Supabase session refresh if URL/anon key are missing so local marketing work still runs; in production, missing env redirects protected routes to `/login?error=config`.

## What to build next (priority)

1. Counsel-reviewed legal copy; real social URLs; contact / newsletter backend
2. Admin project CRUD + migrate public projects off mock data
3. Regenerate `src/types/database.ts` from live schema
4. Custom SMTP for production auth email reliability
5. Pagination when project count grows; project-detail share handlers

## Do not

- Rewrite the public marketing site from scratch without a clear request
- Add purple/glow generic AI aesthetics or a dark theme
- Put business logic only in client components when a Server Action fits
- Invent legal text or hardcode credentials in docs/scripts
- Commit `.env.local` or service-role keys
- Re-enable FR toggle without i18n

## Supabase foundation

- Clients: `src/lib/supabase/` (`client`, `server`, `middleware`, `env`, `storage`)
- Auth email callback: `src/app/auth/callback/route.ts`
- Login / signup / forgot / reset wired; middleware protects `/dashboard` and `/admin`
- Signups always create `profiles.role = 'user'` (admin is bootstrap-only via `db:create-admin`)
- Confirm email + password reset use `/auth/callback` (enable Confirm email in Supabase)
- Payments + receipt storage: migration `003_payments_storage.sql` (`payment_submissions`, `support_tickets`, `receipts` bucket)
- One-command setup: **`npm run setup:supabase`** (see `SUPABASE_SETUP.md`)
- Scripts: `scripts/run-migrations.mjs`, `create-admin.mjs`, `configure-auth.mjs`
- Optional extra buckets: **`supabase/storage-setup.md`**

## Deploy

- Target: **Vercel** + custom domain DNS at **Hostinger**
- Manual steps: **`DEPLOY.md`**
- Production readiness notes: **`PRODUCTION_READINESS.md`**
- Production build: `npm run build` (Turbopack)
- Production **requires** `NEXT_PUBLIC_SITE_URL` + Supabase URL/anon on Vercel
- Set `NEXT_PUBLIC_SITE_URL` on Vercel to the canonical HTTPS domain

## Useful commands

```bash
npm install
cp .env.local.example .env.local   # then fill values
npm run setup:supabase
npm run dev
npm run build
npm run lint
node scripts/check-images.mjs      # Unsplash URL health check
```

## Related docs

- `README.md` — setup and folder overview
- `DEPLOY.md` — Vercel + Hostinger go-live checklist
- `SUPABASE_SETUP.md` — create project, copy API keys, auth email URLs
- `PRODUCTION_READINESS.md` — pre-launch review
- `supabase/storage-setup.md` — storage buckets + RLS SQL
- `logic.md` — product profit / admin overview rules