# Supabase setup (Canada Green) — automated

After you create a project and fill `.env.local`, **one command** does the rest:

```bash
npm run setup:supabase
```

That runs: migrations → create admin user → configure auth (confirm email **ON** + redirect URLs).

---

## Why some steps stay manual

Creating a Supabase **account/project** requires **your** login in a browser. No script can do that for you without your password/OAuth.

Everything else (schema, admin user, auth toggles) is scripted below.

---

## Step 1 — Create a Supabase project (manual, once)

1. Go to [https://supabase.com](https://supabase.com) → sign in → **New project**.
2. Name it e.g. `canada-green`.
3. Choose a strong **database password** and save it (password manager). You’ll need it for `SUPABASE_DB_URL`.
4. Pick a region close to Canada (Canada if listed, else US East).
5. Wait until the project is ready.

---

## Step 2 — Fill `.env.local`

```bash
cp .env.local.example .env.local
```

### A) API keys — **Project Settings → API**

| Env var | Where in dashboard |
|---------|--------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | **Project URL** (`https://xxxx.supabase.co` — no `/rest/v1/`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **anon** / **publishable** key |
| `SUPABASE_SERVICE_ROLE_KEY` | **service_role** / **secret** key (Reveal) — never commit |

Also set:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### B) Database URL — **Project Settings → Database**

1. Open **Connection string** / **URI**.
2. Copy the Postgres URI.
3. Replace `[YOUR-PASSWORD]` with the database password from Step 1.
4. Paste into `.env.local` as `SUPABASE_DB_URL=...`

Use a URI that includes your password. Session / direct connection is fine for this script.

### C) Access token — for auth automation

1. Open [https://supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens)
2. **Generate new token** (name it e.g. `canada-green-setup`)
3. Paste into `.env.local` as `SUPABASE_ACCESS_TOKEN=...`

**Warning:** `SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_ACCESS_TOKEN` are secrets. Never commit them or put them in client code. `.gitignore` already ignores `.env*`.

---

## Step 3 — Run setup (one command)

```bash
npm install
npm run setup:supabase
```

Before running setup, also set in `.env.local`:

```env
ADMIN_EMAIL=your-admin@example.com
ADMIN_PASSWORD=a-strong-unique-password
```

These are **required**. The create-admin script has no default password.

What success looks like:

```
Applying N migration(s)…
  apply 001_auth.sql…
  ok    001_auth.sql
Migrations complete.

Ensuring admin user: your-admin@example.com
Admin user created.   (or: already exists)
Admin role confirmed: your-admin@example.com (role=admin)

Updating auth config for project …
Auth config updated successfully.
```

Individual scripts (same as above, split):

| Command | What it does |
|---------|----------------|
| `npm run db:migrate` | Runs all `supabase/migrations/*.sql` via Postgres |
| `npm run db:create-admin` | Creates admin + sets `profiles.role = 'admin'` (needs `ADMIN_EMAIL` + `ADMIN_PASSWORD`) |
| `npm run db:configure-auth` | Confirm-email **ON** + Site URL + redirect allow list |
| `npm run setup:supabase` | All three in order |

We use a Node + `pg` migrator instead of `supabase db push` so you don’t need interactive `supabase login` / project link.

---

## Step 4 — Log in and verify

```bash
npm run dev
```

1. Open [http://localhost:3000/login](http://localhost:3000/login)
2. Email: the `ADMIN_EMAIL` from your `.env.local`
3. Password: the `ADMIN_PASSWORD` from your `.env.local`
4. You should land on **`/admin`**

**If an older default password was ever used in a live project, rotate it immediately** in Supabase Auth (or change password while logged in) and store the new value only in a password manager / env — never in git.

**Signup flow:** `/signup?ref=ADMIN_REFERRAL_CODE` → confirmation email → confirm link → log in → `/dashboard`.  
Every new signup is created as role **`user`** (only the bootstrap admin is `admin`).

**Forgot password:** works for both admin and users — request link → email → set new password at `/reset-password`.

---

## If something fails

| Symptom | Fix |
|---------|-----|
| Migration: password auth failed | Wrong DB password in `SUPABASE_DB_URL`; reset DB password in dashboard or fix URI |
| Migration: SSL / connection refused | Use the URI from **Database → Connection string**; include `?sslmode=require` if needed |
| create-admin: profile not found | Run `db:migrate` first |
| configure-auth: 401 | Regenerate `SUPABASE_ACCESS_TOKEN` |
| No confirmation / reset emails | Enable **Confirm email** + set redirect URLs (see below), or set `SUPABASE_ACCESS_TOKEN` and run `npm run db:configure-auth` |
| Reset password link broken | Confirm `NEXT_PUBLIC_SITE_URL` matches the URL you open, and redirect URLs include `/auth/callback` |
| Receipt upload fails | Migration `003_payments_storage.sql` creates the `receipts` bucket — re-run `npm run db:migrate` |

### Manual auth settings (when `SUPABASE_ACCESS_TOKEN` is missing)

In Supabase dashboard:

1. **Authentication → Providers → Email → Confirm email = ON**
2. **Authentication → URL Configuration**
   - Site URL: your `NEXT_PUBLIC_SITE_URL` (e.g. `http://localhost:3000`)
   - Redirect URLs:
     - `http://localhost:3000/auth/callback`
     - `http://localhost:3000/**`
     - (production) `https://YOUR_DOMAIN/auth/callback` and `https://YOUR_DOMAIN/**`

---

## Storage

The `receipts` private bucket + RLS policies are created by migration `003_payments_storage.sql` (included in `npm run db:migrate`). Users upload screenshots from **Billing**; admins view them on **Approvals**.

Optional buckets (`project-images`, `avatars`) remain documented in `supabase/storage-setup.md`.
