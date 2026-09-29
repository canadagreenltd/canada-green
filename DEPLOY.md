# Deploy Canada Green (Vercel + Hostinger domain)

Manual checklist to put the **full app** live: marketing site, Supabase Auth, investor dashboard, and admin.

**Prerequisites before production deploy**

1. Supabase project created and `npm run setup:supabase` completed locally (migrations, admin user, auth URLs). See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md).
2. Receipts storage bucket / policies applied (`supabase/storage-setup.md` / migration `003`).
3. Strong unique `ADMIN_PASSWORD` (never committed). Rotate if an old shared default was ever used.
4. Auth email delivery working (Supabase default or custom SMTP).

Also see [PRODUCTION_READINESS.md](./PRODUCTION_READINESS.md) for the latest pre-launch findings.

---

## Before you start

You need:

1. Code on GitHub: `https://github.com/canadagreenltd/canada-green`
2. A [Vercel](https://vercel.com) account (GitHub connected)
3. Your domain purchased at [Hostinger](https://www.hostinger.com) (DNS managed in hPanel)
4. Supabase URL + anon key ready for Vercel env

**Important:** Keep DNS at Hostinger. Point the website records to Vercel.  
Do **not** point the domain at Hostinger website hosting for this app.  
Do **not** change nameservers unless Vercel specifically asks you to (prefer A + CNAME).

Push the latest deploy-ready commits to `main` before importing the project.

---

## Part A — Deploy on Vercel (GitHub)

### 1. Import the repo

1. Open [vercel.com/new](https://vercel.com/new)
2. Sign in with GitHub if needed
3. **Import** `canadagreenltd/canada-green`
4. Confirm settings (leave defaults if shown):
   - **Framework Preset:** Next.js
   - **Root Directory:** `.` (project root)
   - **Build Command:** `npm run build` (or leave default)
   - **Output Directory:** leave default (Next.js handles this)
   - **Install Command:** `npm install`
   - **Node.js Version:** 20.x (Project Settings → General if you need to set it)

### 2. Environment variables (Production + Preview)

In the import screen (or later: **Project → Settings → Environment Variables**), add:

| Name | Value | Notes |
|------|--------|--------|
| `NEXT_PUBLIC_SITE_URL` | `https://canadagreen.ca` | No trailing slash. Prefer apex **or** www to match your Vercel redirect. Temporary: `https://YOURPROJECT.vercel.app` until DNS is ready. |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` | Required for Auth / dashboard / admin |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon / publishable key | Required (browser-safe; RLS still applies) |

**Do not** put `SUPABASE_SERVICE_ROLE_KEY` on Vercel unless you have a deliberate server-only use. Prefer running admin bootstrap scripts (`db:create-admin`, migrations) from a trusted local machine.

Apply variables to **Production**. For **Preview**, either use the same Production values carefully, or set Preview `NEXT_PUBLIC_SITE_URL` to the preview URL and add that URL to Supabase redirect allow list—otherwise auth emails from Preview builds will point at the wrong host.

**Important:** `NEXT_PUBLIC_*` values are baked in at **build time**. After any change, **Redeploy** (Deployments → … → Redeploy). Saving env alone is not enough.

### 3. Deploy

1. Click **Deploy**
2. Wait for the build to finish (green)
3. Open the `*.vercel.app` URL and smoke-test:
   - `/` home, `/projects`, a project detail page
   - `/login` / `/signup?ref=ADMIN_REFERRAL_CODE`
   - After login: `/dashboard` (ranks), `/dashboard/billing`, `/dashboard/team`
   - Admin: `/admin`, Approvals, **Commissions** (`/admin/rewards`), Support, Audit logs
   - `/contact` (honest “email us” messaging — no backend delivery yet)

Every push to `main` will auto-redeploy Production.

### 4. Point Supabase Auth at production

In Supabase → **Authentication → URL Configuration**:

1. **Site URL** = your canonical `https://YOURDOMAIN.com` (or www)
2. **Redirect URLs** include at least:
   - `https://YOURDOMAIN.com/auth/callback`
   - `https://www.YOURDOMAIN.com/auth/callback` (if you use www)
   - `https://YOURPROJECT.vercel.app/auth/callback` (preview / interim)

Or re-run `npm run db:configure-auth` locally after setting `NEXT_PUBLIC_SITE_URL` to the production URL in `.env.local`.

Confirm email must stay **ON** for signup.

---

## Part B — Connect your Hostinger domain to Vercel

### 1. Add the domain in Vercel

1. Vercel → your project → **Settings → Domains**
2. Add:
   - `YOURDOMAIN.com`
   - `www.YOURDOMAIN.com` (recommended)
3. Vercel will show the **exact DNS records** to create. Use those values (do not guess).

Typical pattern (confirm in Vercel UI):

| Type | Name / Host | Value | Where |
|------|-------------|--------|--------|
| **A** | `@` (or blank / root) | Often `76.76.21.21` — **use Vercel’s shown IP** | Apex `YOURDOMAIN.com` |
| **CNAME** | `www` | e.g. `cname.vercel-dns.com` or a project-specific target — **use Vercel’s shown value** | `www.YOURDOMAIN.com` |

Also set redirect in Vercel: prefer **apex → www** or **www → apex** (pick one primary URL).

### 2. Edit DNS in Hostinger

1. Log in to [hPanel](https://hpanel.hostinger.com)
2. Open **Domains** → select your domain → **DNS / DNS Zone Editor**
3. **Remove conflicting records** for the same host:
   - Old **A** / **AAAA** for `@`
   - Old **CNAME** or **A** for `www`
   - Parking / Hostinger “coming soon” page records if present
4. **Keep** email-related records if you use Hostinger email (**MX**, related **TXT**). Do not delete those unless you know you don’t need email.
5. Add the A and CNAME records exactly as Vercel shows.
6. Save.

Propagation: usually minutes to a few hours; can take up to 24–48 hours.

### 3. Wait for SSL

1. Back in Vercel → **Domains**, wait until status is **Valid**
2. Vercel issues HTTPS automatically (Let’s Encrypt)
3. Visit `https://YOURDOMAIN.com` and `https://www.YOURDOMAIN.com`

### 4. Update the site URL env var

Once the custom domain works:

1. Vercel → **Settings → Environment Variables**
2. Set `NEXT_PUBLIC_SITE_URL` to your canonical URL, e.g. `https://www.YOURDOMAIN.com` (or apex — match the redirect you chose)
3. **Redeploy** Production (Deployments → … → Redeploy) so metadata/sitemap use the real domain
4. Update Supabase Auth Site URL / redirect allow list to match

---

## Part C — Go-live checklist

After go-live, verify:

- [ ] Home, EV, Agriculture, Projects, FAQ, Contact, About load
- [ ] Images load (Unsplash)
- [ ] Mobile menu works
- [ ] HTTPS padlock shows
- [ ] Both apex and www resolve (or one redirects to the other)
- [ ] `/robots.txt` disallows `/admin`, `/dashboard`, auth routes
- [ ] `/sitemap.xml` uses the production domain (not localhost)
- [ ] Signup → confirm email → login → `/dashboard` (rank card visible)
- [ ] Forgot / reset password works
- [ ] Team tab tree + referral note; invite link works
- [ ] Billing: submit payment + receipt upload
- [ ] Admin: approve / decline payment; support tickets; audit log entries appear
- [ ] Admin → Commissions shows referral totals
- [ ] Admin password is unique and not stored in git
- [ ] After any `NEXT_PUBLIC_*` change, Production was **redeployed**

**Still business-owned (not blocked by code, but important):**

- Counsel-reviewed Terms / Privacy / Risk Disclosure
- Contact form / newsletter / social profile backends
- Custom SMTP for reliable auth email in production
- Soften or replace mock testimonials/projects if you do not want them presented as live catalog

---

## Troubleshooting

| Issue | What to do |
|-------|------------|
| Build fails on Vercel | Open the deployment log; locally run `npm run build` and fix before pushing |
| Domain “Invalid Configuration” | Compare Hostinger DNS to Vercel’s domain card; remove duplicate A/AAAA/CNAME |
| Site still shows Hostinger parking | Old A records not removed, or DNS not propagated yet |
| Email broke after DNS change | Restore Hostinger **MX** (and SPF **TXT**) records |
| Wrong canonical links / OG URLs | Fix `NEXT_PUBLIC_SITE_URL` and redeploy |
| Login / dashboard redirect loops | Confirm Supabase URL + anon key on Vercel; check Auth redirect URLs |
| `?error=config` on login | Production is missing Supabase env vars |
| Auth emails not arriving | Configure custom SMTP in Supabase; check spam; confirm email settings |

Useful checks (on your PC):

```powershell
nslookup YOURDOMAIN.com
nslookup www.YOURDOMAIN.com
```

---

## Related docs

- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) — project + migrations + admin bootstrap
- [PRODUCTION_READINESS.md](./PRODUCTION_READINESS.md) — pre-launch review notes
- [AGENTS.md](./AGENTS.md) — codebase conventions
