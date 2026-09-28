# Production readiness — Canada Green

Pre-launch review completed **2026-09-28** for Vercel + custom domain.  
Scope: harden security, remove verified clutter, SEO/a11y polish, honest shipping copy, docs sync — **no feature redesign**, **no invented legal text**.

---

## Verdict

**Technically deployable** once you set production env vars, point Supabase Auth at your domain, and accept (or clear) the business blockers below.

Code quality gates after all phases: **lint pass**, **`tsc --noEmit` pass**, **`npm run build` pass**.

What engineering already handled is listed under [Removed and changed](#removed-and-changed). What only you / counsel / ops can finish is under [Needs your decision](#needs-your-decision) and [Blockers](#blockers-before-go-live).

---

## Removed and changed

### Security

| Change | Why |
|--------|-----|
| Removed hardcoded admin password default from `scripts/create-admin.mjs` | Fail closed: requires `ADMIN_EMAIL` + `ADMIN_PASSWORD` from env |
| Scrubbed plaintext password from `SUPABASE_SETUP.md` | Secrets must not live in docs |
| Documented `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env.local.example` | Setup scripts need explicit env |
| Added security headers in `next.config.ts` | `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, HSTS |

**Verified:** service role key is **not** imported under `src/` (scripts only).

### Cleanup (verified unused)

| Removed | Why |
|---------|-----|
| `public/file.svg`, `vercel.svg`, `window.svg` (+ any leftover create-next SVGs) | Unused marketing leftovers |
| `src/components/shared/demo-banner.tsx` | Unreferenced |
| `src/lib/mock-data/admin.ts`, `user-dashboard.ts` | Empty deprecated stubs |
| npm deps `browser-image-compression`, `date-fns` | No app imports |
| Moved `shadcn` → `devDependencies` | CLI tooling, not a runtime import |

### Kept / uncertain (not deleted)

- Stub files `src/actions/auth.ts`, `admin.ts`, `projects.ts` (unused hooks for later)
- Unused UI primitives `avatar.tsx`, `dropdown-menu.tsx` (no imports; may be used when extending shadcn)
- Redirect-only legacy routes (`/admin/projects*`, `/dashboard/investments*`, etc.)
- Public mock projects / FAQ / testimonials (still power marketing)
- `logic.md` (product rules)
- Payment wallet / bank details in `src/lib/constants.ts` (public payment instructions, not app secrets)

### SEO / sharing / a11y

| Change | Why |
|--------|-----|
| `src/app/opengraph-image.tsx` + Twitter card metadata | Sharing previews |
| `src/app/apple-icon.tsx` | Home-screen icon; kept `icon.svg` |
| `robots.ts` disallow list expanded (`/auth/` prefixes) | Keep private areas out of indexes |
| Dashboard / admin / auth layouts: `robots: { index: false }` | Extra noindex signal |
| `sitemap.ts` excludes legal stubs | Placeholders should not be promoted in search until counsel copy ships |
| Logout button `aria-label` | Icon-only on small screens |

### Honesty / docs

| Change | Why |
|--------|-----|
| Contact form no longer claims “Message sent” | No backend delivery |
| Contact page points users to `hello@canadagreen.ca` | Honest path to reach you |
| Footer newsletter Subscribe removed | Was a dead control |
| `DEPLOY.md`, `README.md`, `AGENTS.md` rewritten for live Auth/dashboard/admin | Soft-launch “stubs OK” language was wrong |

---

## Security and performance findings

### Before → after

| Area | Before | After |
|------|--------|--------|
| Admin bootstrap password | Hardcoded default in script + docs | Env-only; docs scrubbed |
| HTTP security headers | None in Next config | Frame deny, nosniff, referrer, permissions, HSTS |
| Protected routes without Supabase env (prod) | Already redirected to `/login?error=config` | Unchanged (confirmed) |
| Unused deps | `browser-image-compression`, `date-fns` in dependencies | Removed; lockfile lighter for those |
| OG / Twitter | Title/description only | Large image card + generated OG/apple icons |
| Sitemap legal stubs | Included `/terms`, `/privacy`, `/risk-disclosure` | Excluded until real copy |
| Build | Passing | Still passing (Turbopack production build) |

### Production smoke test (local `next start`, 2026-09-28)

| Check | Result |
|-------|--------|
| Public routes (`/`, `/projects`, detail, sectors, FAQ, contact, legal) | **200** |
| Auth pages (login, signup, forgot, reset) | **200** |
| `/dashboard`, `/admin` unauthenticated | **307** redirect (middleware) |
| `/robots.txt` | Disallows admin/dashboard/auth |
| `/sitemap.xml` | Projects included; legal stubs excluded |
| Security headers on `/` | Present (see above) |
| `/opengraph-image`, `/apple-icon`, `/icon.svg` | **200** |

### Auth / money flows (manual — needs your Supabase project)

These were previously built and exercised in development against your Supabase project. Re-verify on the **Vercel deployment** (or local prod server with real `.env.local`):

| Flow | Code status | Prod verification |
|------|-------------|-------------------|
| Signup + confirm email | Implemented | **You** — confirm email on custom domain |
| Login / logout | Implemented | **You** |
| Forgot / reset password | Implemented | **You** |
| Browse projects | Mock data — works offline | OK on smoke test |
| Payment + receipt upload | Server Action + storage | **You** — receipts bucket must exist |
| Admin approve / decline | Live + audit log write | **You** |
| Support tickets | Live | **You** |
| Audit log UI | Live from `audit_logs` | **You** |

### Performance notes

- Fonts via `next/font`; images via `next/image` (Unsplash + Supabase remotes allowed).
- Home First Load JS ~211 kB after cleanup (build output).
- Recommend a Lighthouse run on the Vercel preview URL (mobile + desktop) after DNS; not run here as a CI gate.

---

## Needs your decision

1. **Legal copy** — supply counsel-reviewed Terms, Privacy, Risk Disclosure (or accept shipping placeholders with business risk).
2. **Contact / newsletter backend** — keep email-only, or wire Formspree / Resend / similar.
3. **Social profile URLs** — footer icons stay “coming soon” until you provide real links.
4. **Admin password rotation** — if any shared/default password was ever used on a live Supabase project, rotate it now and store only in a password manager / env.
5. **Auth email SMTP** — Supabase default email is fine for testing; production should use custom SMTP.
6. **Canonical domain** — apex vs `www` (set Vercel redirect + `NEXT_PUBLIC_SITE_URL` + Supabase Site URL to match).
7. **Public projects** — remain mock until you want admin project CRUD / DB-backed catalog.

---

## Blockers before go-live

| # | Blocker | Owner |
|---|---------|--------|
| 1 | Set Vercel env: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | You |
| 2 | Supabase Auth **Site URL** + redirect allow list for production (+ vercel.app interim) | You |
| 3 | Confirm migrations + receipts storage applied on the **production** Supabase project | You |
| 4 | Bootstrap admin via env (`ADMIN_EMAIL` / `ADMIN_PASSWORD`); no defaults in repo | You |
| 5 | Confirm email delivery works for signup / reset on the live domain | You |
| 6 | Legal placeholders — business acceptance or counsel copy before marketing as fully compliant | You / counsel |

**Not code blockers (known gaps):** contact form backend, newsletter, social links, admin project CRUD, DB-backed public projects.

---

## Go-live checklist (Vercel + domain)

### A. Supabase (if not already done)

1. Create / use production Supabase project.
2. Fill local `.env.local` from `.env.local.example` (including `ADMIN_EMAIL`, `ADMIN_PASSWORD`).
3. Run `npm run setup:supabase`.
4. Confirm receipts bucket / storage policies (`supabase/storage-setup.md` / migration `003`).
5. Confirm email ON; test one signup + one password reset locally.

### B. Vercel

1. Import `canadagreenltd/canada-green` (or push latest `main`).
2. Node **20.x**.
3. Env (Production + Preview):
   - `NEXT_PUBLIC_SITE_URL=https://YOURDOMAIN.com` (no trailing slash)
   - `NEXT_PUBLIC_SUPABASE_URL=...`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`
4. Deploy; open `*.vercel.app` and smoke-test marketing + login.
5. **Do not** put `SUPABASE_SERVICE_ROLE_KEY` on Vercel unless you have a deliberate server need (prefer local scripts).

### C. Auth URLs for production

1. Supabase → Authentication → URL Configuration.
2. Site URL = canonical HTTPS domain.
3. Redirect URLs include `/auth/callback` for apex, www (if used), and `*.vercel.app`.

### D. Hostinger DNS → Vercel

1. Vercel → Domains → add apex + www; copy exact records.
2. Hostinger DNS: replace conflicting A/CNAME; **keep MX** if you use Hostinger email.
3. Wait for Valid + HTTPS.
4. Set Vercel redirect apex ↔ www to one canonical host.
5. Update `NEXT_PUBLIC_SITE_URL` + Supabase Site URL; **redeploy**.

### E. Final smoke (production domain)

- [ ] Home / projects / images / mobile nav
- [ ] HTTPS padlock; apex + www behavior
- [ ] `/robots.txt` and `/sitemap.xml` use production host (not localhost)
- [ ] Signup → confirm email → dashboard
- [ ] Forgot / reset password
- [ ] Billing payment + receipt
- [ ] Admin approve/decline; support; audit log row appears
- [ ] Contact page shows email path (no false “sent” claim)

---

## Plain-language summary

**Ready to deploy?** Yes — the app builds cleanly, secrets were scrubbed from the repo, private areas are blocked from search engines, and security headers are on. Auth, billing, and admin are real features, not stubs.

**What you still need to do:** put Supabase + site URL on Vercel, point your Hostinger DNS at Vercel, align Supabase Auth redirect URLs to the live domain, confirm email + receipts storage work there, and decide what to do about legal copy / contact backend / social links.

**What was already handled here:** secret scrubbing, unused file/dependency cleanup, security headers, OG/icons/robots/sitemap hardening, honest contact/newsletter messaging, and updated deploy/docs (`DEPLOY.md`, `README.md`, `AGENTS.md`, this file).
