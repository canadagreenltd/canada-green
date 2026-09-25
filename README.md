# Canada Green

Crowdfunding platform for EV charging infrastructure and agriculture investment projects in Canada.

## Stack

- **Next.js 15** (App Router) + TypeScript + Tailwind CSS v4
- **Supabase** (Postgres, Auth, Storage) via `@supabase/supabase-js` and `@supabase/ssr`
- **shadcn/ui** (Radix / Base UI) + **lucide-react**
- **react-hook-form** + **zod** for forms
- Deploy target: **Vercel**

## Getting started

```bash
# Install dependencies
npm install

# Copy env template and fill in Supabase keys
cp .env.local.example .env.local

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy (Vercel + Hostinger domain)

Step-by-step manual guide: **[DEPLOY.md](./DEPLOY.md)**

Soft launch works **without** Supabase env vars (marketing site + mock data).

## Environment variables

Copy `.env.local.example` to `.env.local` and set:

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (`http://localhost:3000` locally; `https://yourdomain.com` on Vercel) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (optional until Auth/DB) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key (optional until Auth/DB) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-only; never expose to the client) |

## Folder structure

```
src/
  app/
    (public)/          → Marketing site (no auth)
    (auth)/            → Login, signup, password reset
    (dashboard)/       → Logged-in user area
    (admin)/           → Admin-only area
    api/               → Route handlers (minimal; prefer Server Actions)
    layout.tsx         → Root layout
    globals.css

  components/
    ui/                → shadcn/ui components
    public/            → Marketing-only components
    dashboard/         → User dashboard components
    admin/             → Admin dashboard components
    shared/            → Cross-area components (logo, badges, etc.)

  lib/
    supabase/          → Browser, server, and middleware clients
    validations/       → Zod schemas
    utils.ts           → cn() and helpers
    constants.ts       → Sectors, payment statuses, roles

  actions/             → Server Actions by domain (auth, projects, payments, admin)
  types/               → Shared + Supabase-generated types
  middleware.ts        → Session refresh + (later) route protection
```

Route groups `(public)`, `(auth)`, `(dashboard)`, and `(admin)` organize layouts without changing URLs.

### Key routes

| Area | Paths |
| --- | --- |
| Public | `/`, `/ev`, `/agriculture`, `/projects`, `/projects/[id]`, `/about`, `/how-it-works`, `/faq`, `/contact` |
| Auth | `/login`, `/signup`, `/forgot-password`, `/reset-password` |
| User | `/dashboard`, `/dashboard/investments`, `/dashboard/payments/new`, `/dashboard/profile` |
| Admin | `/admin`, `/admin/payments`, `/admin/projects`, `/admin/users` |

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Next.js with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |

## Notes

- **Public marketing site** is implemented on mock data and is ready to soft-launch.
- Auth, dashboard, admin, and Supabase schema are still stubs — see `AGENTS.md`.
- shadcn forms use the `field` component with `react-hook-form` + `zod`.
- Toasts use **sonner** (`components/ui/sonner.tsx`).
