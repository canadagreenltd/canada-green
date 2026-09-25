# AGENTS.md — Canada Green

Guidance for AI coding agents working in this repository.

## What this project is

**Canada Green** is a crowdfunding platform for **EV charging** and **agriculture** investment projects in Canada. Investors browse projects, (eventually) sign up, invest, and track payments; admins manage projects, payments, and users.

Deploy target: **Vercel**.

## Current status (as of project review)

| Area | Status |
|------|--------|
| Public marketing site | **Done** — full UI on mock data |
| Legal stubs (`/terms`, `/privacy`, `/risk-disclosure`) | Placeholder notices only |
| Auth pages + `actions/auth.ts` | **Stub** (“coming soon”) |
| User dashboard + `components/dashboard/` | **Stub** |
| Admin area + `components/admin/` | **Stub** |
| Server actions (projects, payments, admin) | **Stub** |
| Supabase clients / middleware session refresh | Wired; needs env + real schema |
| Route protection / roles | **Not implemented** |
| Contact form | Frontend-only (toast; no backend) |

**Mental model:** polish and extend the public site carefully; the next major work is Supabase Auth + schema, then dashboard/admin + real Server Actions. Do not treat auth/admin/dashboard stubs as finished features.

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
    (auth)/       → Login, signup, password reset — stubs
    (dashboard)/  → Logged-in user — stubs
    (admin)/      → Admin-only — stubs
    api/          → Prefer Server Actions; keep API minimal
  actions/        → Domain Server Actions (auth, projects, payments, admin)
  components/
    ui/           → shadcn primitives
    public/       → Marketing components
    dashboard/    → User dashboard (empty)
    admin/        → Admin UI (empty)
    shared/       → Logo, ticker, theme, badges, progress, etc.
  lib/
    supabase/     → client, server, middleware helpers
    mock-data/    → projects, faq, testimonials (public UI source of truth today)
    validations/  → Zod schemas (contact exists)
    constants.ts  → SECTORS, PAYMENT_STATUSES, ROLES
  types/          → Shared types; database.ts is a placeholder until generated
  middleware.ts   → Session refresh only
```

Route groups organize layouts; URLs stay flat (`/`, `/login`, `/dashboard`, `/admin`, …).

## Key routes

| Area | Paths |
|------|--------|
| Public | `/`, `/ev`, `/agriculture`, `/projects`, `/projects/[id]`, `/about`, `/how-it-works`, `/impact`, `/faq`, `/contact`, `/terms`, `/privacy`, `/risk-disclosure` |
| Auth | `/login`, `/signup`, `/forgot-password`, `/reset-password` |
| User | `/dashboard`, `/dashboard/investments`, `/dashboard/investments/[id]`, `/dashboard/payments/new`, `/dashboard/profile` |
| Admin | `/admin`, `/admin/payments`, `/admin/projects`, `/admin/projects/new`, `/admin/projects/[id]/edit`, `/admin/users` |

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
9. **Middleware:** session refresh only today. When adding auth, put redirects/role checks in `middleware.ts` / `lib/supabase/middleware.ts` — do not leave protected routes open.
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
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only |
| `NEXT_PUBLIC_SITE_URL` | e.g. `http://localhost:3000` |

Middleware no-ops Supabase session refresh if URL/anon key are missing so local marketing work still runs.

## What to build next (priority)

1. Supabase schema + regenerate `src/types/database.ts`
2. Auth flows + `actions/auth.ts` + middleware route protection
3. User dashboard shell + investments/payments/profile against real data
4. Admin CRUD (projects, payments, users) + corresponding actions
5. Wire contact (and later newsletter) to a real backend
6. Real social URLs; project-detail share handlers; counsel-reviewed legal copy; pagination when project count grows

## Do not

- Rewrite the public marketing site from scratch without a clear request
- Add purple/glow generic AI aesthetics or a dark theme
- Put business logic only in client components when a Server Action fits
- Treat stub pages as production-complete
- Commit `.env.local` or service-role keys
- Re-enable FR toggle without i18n

## Useful commands

```bash
npm install
cp .env.local.example .env.local   # then fill values
npm run dev
npm run build
npm run lint
node scripts/check-images.mjs      # Unsplash URL health check
```

## Related docs

- `README.md` — setup and folder overview (public content note may lag behind reality)
- `AUDIT.md` — public-site audit decisions (ticker scroll-away, nav at `lg`, legal stubs, etc.)
