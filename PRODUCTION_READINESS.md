# Production readiness — Canada Green

Updated **2026-09-29** for Vercel + Hostinger domain go-live (post Team ranks, commissions, DB cleanup).

---

## Verdict

**Technically ready to deploy.** Auth, investor dashboard (billing, Team, ranks), admin (approvals, commissions, support, audit), security headers, and SEO basics are in place. Lint / typecheck / production build pass after this harden pass.

**You still must:** set Vercel env → redeploy, point Hostinger DNS to Vercel, align Supabase Auth URLs, confirm SMTP + receipts storage, and accept (or replace) legal stubs / mock marketing content.

---

## What this pass changed (2026-09-29)

| Change | Why |
|--------|-----|
| `getSiteUrl()` + layout / robots / sitemap share one helper | Production never falls back to `localhost` for auth emails or OG |
| Canonical fallback `https://canadagreen.ca` when env missing in prod | Safer cutover if SITE_URL briefly unset |
| Deleted stub `actions/{auth,admin,projects}.ts` | Unused clutter |
| Deleted unused UI: `avatar`, `dropdown-menu`, `card`, `skeleton` | No importers |
| Docs: DEPLOY / this file / route lists | Team, ranks, Commissions, Hostinger + redeploy notes |

Earlier pass (2026-09-28): secrets scrubbed, security headers, OG/icons, honest contact copy, unused deps/assets removed.

---

## Security & SEO (current)

- Headers: `X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, HSTS (`next.config.ts`)
- Middleware protects `/dashboard` + `/admin`; prod without Supabase → `/login?error=config`
- Service role: scripts only — do **not** put on Vercel
- Robots disallow private/auth paths; sitemap excludes legal stubs
- `NEXT_PUBLIC_*` is **build-time** — change env → **Redeploy**

---

## Needs your decision

1. Legal counsel copy for Terms / Privacy / Risk (or accept placeholders)
2. Contact / newsletter backend vs email-only
3. Real social URLs
4. Apex vs `www` as canonical (match Vercel redirect + `NEXT_PUBLIC_SITE_URL` + Supabase Site URL)
5. Whether mock projects/testimonials are OK on the live brand domain
6. Custom SMTP for production auth email

---

## Blockers before go-live

| # | Blocker | Owner |
|---|---------|--------|
| 1 | Vercel: `NEXT_PUBLIC_SITE_URL`, Supabase URL + anon → **Redeploy** | You |
| 2 | Supabase Auth Site URL + `/auth/callback` for apex, www, `*.vercel.app` | You |
| 3 | Hostinger DNS A/CNAME → Vercel; **keep MX** | You |
| 4 | Migrations through `008` + receipts bucket on prod Supabase | You |
| 5 | Auth email delivery on live domain | You |
| 6 | Legal / marketing honesty acceptance | You / counsel |

**Not code blockers:** contact backend, newsletter, socials, project CRUD, unused `user_rewards` table (ranks are automatic).

---

## Go-live checklist (short)

See full steps in [DEPLOY.md](./DEPLOY.md).

1. Push latest `main` → Vercel  
2. Set Production env (`SITE_URL=https://canadagreen.ca` or your chosen canonical) → Redeploy  
3. Supabase Auth URLs match that host  
4. Hostinger DNS → Vercel; wait for SSL Valid  
5. Smoke: signup → confirm → dashboard/Team → billing → admin approve → Commissions  

Optional: `CONFIRM=YES npm run db:cleanup` already wiped non-admin test users once; only re-run if you need another wipe before launch.

---

## Plain-language summary

The app is production-ready on the engineering side. Point your Hostinger domain at Vercel, set the three public env vars and redeploy, fix Supabase Auth redirects for that domain, then smoke-test signup and payments. Legal text and contact backends remain business decisions—not code blockers.
