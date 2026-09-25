# Deploy Canada Green (Vercel + Hostinger domain)

Manual checklist to put the **soft-launch marketing site** live.
Auth, dashboard, and admin are still stubs — that is expected for this release.

---

## Before you start

You need:

1. Code on GitHub: `https://github.com/canadagreenltd/canada-green`
2. A [Vercel](https://vercel.com) account (GitHub connected)
3. Your domain purchased at [Hostinger](https://www.hostinger.com) (DNS managed in hPanel)

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
| `NEXT_PUBLIC_SITE_URL` | `https://YOURDOMAIN.com` | No trailing slash. Use your real domain (or the `*.vercel.app` URL temporarily until DNS is ready). |

**Supabase (optional for soft launch):**

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | leave empty / skip for now |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | skip for now |
| `SUPABASE_SERVICE_ROLE_KEY` | skip for now |

Middleware already skips Supabase when those are missing. Add them later when Auth/DB are ready.

Apply variables to **Production** and **Preview**.

### 3. Deploy

1. Click **Deploy**
2. Wait for the build to finish (green)
3. Open the `*.vercel.app` URL and smoke-test:
   - `/` home
   - `/projects` and a project detail page
   - `/contact` (toast only — no backend yet)
   - Login / Dashboard links may say “coming soon” — OK for soft launch

Every push to `main` will auto-redeploy Production.

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

---

## Part C — Soft-launch checklist

After go-live, quickly verify:

- [ ] Home, EV, Agriculture, Projects, FAQ, Contact, About load
- [ ] Images load (Unsplash)
- [ ] Mobile menu works
- [ ] HTTPS padlock shows
- [ ] Both apex and www resolve (or one redirects to the other)
- [ ] `/robots.txt` and `/sitemap.xml` load
- [ ] Stub routes (`/login`, `/dashboard`, `/admin`) are acceptable “coming soon” pages

**Not live yet (by design):** real auth, payments, admin CRUD, contact backend, full legal docs.

---

## Troubleshooting

| Issue | What to do |
|-------|------------|
| Build fails on Vercel | Open the deployment log; locally run `npm run build` and fix before pushing |
| Domain “Invalid Configuration” | Compare Hostinger DNS to Vercel’s domain card; remove duplicate A/AAAA/CNAME |
| Site still shows Hostinger parking | Old A records not removed, or DNS not propagated yet |
| Email broke after DNS change | Restore Hostinger **MX** (and SPF **TXT**) records |
| Wrong canonical links / OG URLs | Fix `NEXT_PUBLIC_SITE_URL` and redeploy |
| 404 on refresh of a path | Unusual for Next on Vercel; confirm Framework is Next.js and Root Directory is correct |

Useful checks (on your PC):

```powershell
nslookup YOURDOMAIN.com
nslookup www.YOURDOMAIN.com
```

---

## After soft launch (later work)

1. Create Supabase project → add URL + anon key (+ service role server-only) on Vercel  
2. Implement Auth + middleware protection  
3. Build dashboard / admin + real Server Actions  
4. Wire contact form to email/API  
5. Replace legal stubs with counsel-reviewed copy  

See `AGENTS.md` for codebase conventions while continuing development.
