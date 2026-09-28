# Supabase Storage setup (Canada Green)

Run this **after** you create your Supabase project.  
Bucket creation and policies are done in the **Supabase Dashboard** (or SQL Editor) — not from Next.js.

App helpers live in `src/lib/supabase/storage.ts` and are ready once buckets + credentials exist.

> **Note:** Admin policies below assume a future `public.profiles` table with  
> `id uuid primary key references auth.users (id)` and `role text` (`'user'` | `'admin'`).  
> Create that table in the next schema step, then run these policies. Until then,  
> skip the admin policy statements or they will fail.

---

## Dashboard bucket settings (create first)

In Supabase: **Storage → New bucket** for each row.

| Bucket | Public? | File size limit | Allowed MIME types |
|--------|---------|-----------------|--------------------|
| `receipts` | **No** (private) | **5 MB** | `image/jpeg`, `image/png`, `application/pdf` |
| `project-images` | **Yes** (public) | **5 MB** | `image/jpeg`, `image/png`, `image/webp` |
| `avatars` | **Yes** (public) | **5 MB** | `image/jpeg`, `image/png`, `image/webp` |

Suggested object paths (enforced by policies + app helpers):

- Receipts: `{user_id}/{timestamp}-{filename}`
- Project images: `{project_id}/{timestamp}-{filename}`
- Avatars: `{user_id}/{timestamp}-{filename}`

---

## Helper: `is_admin()` (run once in SQL Editor)

```sql
-- Requires public.profiles(id, role) — create in the next schema phase.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;
```

---

## 1. `receipts` (private)

Access goals:

- **Insert:** authenticated owner only (folder = their `auth.uid()`)
- **Select / update / delete:** owner **or** admin
- **No public access**

```sql
-- Enable RLS is automatic on storage.objects; add policies:

-- INSERT: owner uploads into their own folder
create policy "receipts_insert_own"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'receipts'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- SELECT: owner or admin
create policy "receipts_select_own_or_admin"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'receipts'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.is_admin()
  )
);

-- UPDATE: owner or admin
create policy "receipts_update_own_or_admin"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'receipts'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.is_admin()
  )
)
with check (
  bucket_id = 'receipts'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.is_admin()
  )
);

-- DELETE: owner or admin
create policy "receipts_delete_own_or_admin"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'receipts'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.is_admin()
  )
);
```

App usage: `uploadReceipt()`, `getSignedReceiptUrl()` in `src/lib/supabase/storage.ts`.

---

## 2. `project-images` (public)

Access goals:

- **Select:** anyone (public bucket + select policy for `anon` / `authenticated`)
- **Insert / update / delete:** admin only

```sql
-- Public read
create policy "project_images_select_public"
on storage.objects
for select
to public
using (bucket_id = 'project-images');

-- Admin write
create policy "project_images_insert_admin"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'project-images'
  and public.is_admin()
);

create policy "project_images_update_admin"
on storage.objects
for update
to authenticated
using (bucket_id = 'project-images' and public.is_admin())
with check (bucket_id = 'project-images' and public.is_admin());

create policy "project_images_delete_admin"
on storage.objects
for delete
to authenticated
using (bucket_id = 'project-images' and public.is_admin());
```

App usage: `uploadProjectImage()`, `getPublicStorageUrl()`.

---

## 3. `avatars` (public, optional)

Access goals:

- **Select:** public
- **Insert / update / delete:** owner only (folder = their `auth.uid()`)

```sql
create policy "avatars_select_public"
on storage.objects
for select
to public
using (bucket_id = 'avatars');

create policy "avatars_insert_own"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "avatars_update_own"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "avatars_delete_own"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);
```

---

## Checklist

1. Create the three buckets with size + MIME limits in the dashboard  
2. After `profiles` + roles exist, create `is_admin()` then run the policies  
3. Confirm `NEXT_PUBLIC_SUPABASE_*` are set in `.env.local`  
4. Test an upload from the future payment / admin UI using `storage.ts` helpers  

Do **not** use the service role key in the browser for uploads — RLS + the anon key is the correct path for user uploads.
