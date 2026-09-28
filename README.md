# Canada Green

Crowdfunding platform for EV charging infrastructure and agriculture investment projects in Canada.

## Stack

- **Next.js 15** (App Router) + TypeScript + Tailwind CSS v4
- **Supabase** (Postgres, Auth, Storage) via `@supabase/supabase-js` and `@supabase/ssr`
- **shadcn/ui** (Base UI) + **lucide-react**
- **react-hook-form** + **zod** for forms
- Deploy target: **Vercel**

## Getting started

```bash
# Install dependencies
npm install

# Copy env template and fill in Supabase keys (+ ADMIN_EMAIL / ADMIN_PASSWORD for setup)
cp .env.local.example .env.local

# After creating a Supabase project and filling .env.local:
npm run setup:supabase

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Setup details: **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**  
Deploy (Vercel + Hostinger): **[DEPLOY.md](./DEPLOY.md)**  
Pre-launch review: **[PRODUCTION_READINESS.md](./PRODUCTION_READINESS.md)**

## Environment variables

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (`http://localhost:3000` locally; `https://yourdomain.com` on Vercel) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server/scripts only; never expose to the client) |
| `SUPABASE_DB_URL` | Postgres URI for migrations (local setup scripts) |
| `SUPABASE_ACCESS_TOKEN` | Management API token for auth config automation |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Bootstrap admin for `npm run db:create-admin` |

## Folder structure

```
src/
  app/
    (public)/          → Marketing site (no auth)
    (auth)/            → Login, signup, password reset
    (dashboard)/       → Logged-in investor area
    (admin)/           → Admin-only area
    auth/callback/     → Supabase email confirm / recovery callback
    layout.tsx         → Root layout
    globals.css

  components/
    ui/                → shadcn/ui components
    public/            → Marketing-only components
    dashboard/         → User dashboard components
    admin/             → Admin dashboard components
    shared/            → Cross-area components (logo, badges, etc.)
    auth/              → Auth forms + logout

  lib/
    supabase/          → Browser, server, and middleware clients
    mock-data/         → Public marketing projects / FAQ / testimonials
    validations/       → Zod schemas
    utils.ts           → cn() and helpers
    constants.ts       → Sectors, payment statuses, roles, payment instructions
    profit.ts          → Active-plan profit calculation

  actions/             → Server Actions (payments primary; stubs for future domains)
  types/               → Shared + database types
  middleware.ts        → Session refresh + /dashboard + /admin protection
```

### Key routes

| Area | Paths |
| --- | --- |
| Public | `/`, `/ev`, `/agriculture`, `/projects`, `/projects/[id]`, `/about`, `/how-it-works`, `/impact`, `/faq`, `/contact`, `/terms`, `/privacy`, `/risk-disclosure` |
| Auth | `/login`, `/signup`, `/forgot-password`, `/reset-password` |
| User | `/dashboard`, `/dashboard/billing`, `/dashboard/team` |
| Admin | `/admin`, `/admin/approvals`, `/admin/support`, `/admin/audit-logs` |

Legacy paths such as `/dashboard/investments` and `/admin/projects` redirect to the current surfaces.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Next.js with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |
| `npm run setup:supabase` | Migrate + create admin + configure auth |
| `npm run db:migrate` | Apply SQL migrations |
| `npm run db:create-admin` | Bootstrap admin (needs `ADMIN_EMAIL` + `ADMIN_PASSWORD`) |
| `npm run db:configure-auth` | Confirm-email ON + redirect URLs |

## Notes

- Public marketing projects still use mock data until project CRUD is backed by Supabase.
- Auth, investor dashboard, billing, and admin approvals/support/audit are live against Supabase.
- Legal pages are placeholders pending counsel-reviewed copy.
- Contact form and newsletter are not backend-wired; use `hello@canadagreen.ca`.
- Never commit `.env.local` or service-role keys.
