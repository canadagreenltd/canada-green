/*
=============================================================================
Canada Green — Payments, support tickets, receipt storage

  npm run db:migrate

- payment_submissions: user bank-transfer receipts for admin review
- support_tickets: user help messages
- storage.buckets + RLS for private `receipts` uploads
- Signup always creates role = 'user' (admin is bootstrap-only)
=============================================================================
*/

-- ---------------------------------------------------------------------------
-- Always create new auth users as role = 'user'
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_code text;
  referrer_id uuid;
  incoming_code text;
  skip_referral boolean;
begin
  loop
    new_code := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 8));
    exit when not exists (
      select 1 from public.profiles where referral_code = new_code
    );
  end loop;

  skip_referral := coalesce(new.raw_user_meta_data->>'skip_referral', '') = 'true';
  incoming_code := nullif(trim(coalesce(new.raw_user_meta_data->>'referral_code', '')), '');

  if not skip_referral then
    if incoming_code is null then
      raise exception 'referral_code is required';
    end if;

    select id into referrer_id
    from public.profiles
    where referral_code = upper(incoming_code)
    limit 1;

    if referrer_id is null then
      raise exception 'invalid referral_code';
    end if;
  end if;

  insert into public.profiles (id, full_name, email, role, referral_code, referred_by)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.email, ''),
    'user',
    new_code,
    referrer_id
  );

  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Payment submissions (receipts)
-- ---------------------------------------------------------------------------
create table if not exists public.payment_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  amount_cad numeric(12, 2) not null
    check (amount_cad >= 100),
  receipt_path text not null,
  status text not null default 'pending'
    check (status in ('pending', 'active', 'declined')),
  decline_reason text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles (id) on delete set null
);

create index if not exists payment_submissions_user_id_idx
  on public.payment_submissions (user_id);
create index if not exists payment_submissions_status_idx
  on public.payment_submissions (status);
create index if not exists payment_submissions_created_at_idx
  on public.payment_submissions (created_at desc);

alter table public.payment_submissions enable row level security;

drop policy if exists "payments_select_own" on public.payment_submissions;
create policy "payments_select_own"
  on public.payment_submissions
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "payments_select_admin" on public.payment_submissions;
create policy "payments_select_admin"
  on public.payment_submissions
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists "payments_insert_own" on public.payment_submissions;
create policy "payments_insert_own"
  on public.payment_submissions
  for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and status = 'pending'
  );

drop policy if exists "payments_update_admin" on public.payment_submissions;
create policy "payments_update_admin"
  on public.payment_submissions
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Support tickets
-- ---------------------------------------------------------------------------
create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  message text not null check (char_length(trim(message)) >= 5),
  status text not null default 'open'
    check (status in ('open', 'closed')),
  created_at timestamptz not null default now(),
  closed_at timestamptz
);

create index if not exists support_tickets_user_id_idx
  on public.support_tickets (user_id);
create index if not exists support_tickets_status_idx
  on public.support_tickets (status);
create index if not exists support_tickets_created_at_idx
  on public.support_tickets (created_at desc);

alter table public.support_tickets enable row level security;

drop policy if exists "tickets_select_own" on public.support_tickets;
create policy "tickets_select_own"
  on public.support_tickets
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "tickets_select_admin" on public.support_tickets;
create policy "tickets_select_admin"
  on public.support_tickets
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists "tickets_insert_own" on public.support_tickets;
create policy "tickets_insert_own"
  on public.support_tickets
  for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and status = 'open'
  );

drop policy if exists "tickets_update_admin" on public.support_tickets;
create policy "tickets_update_admin"
  on public.support_tickets
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Team: read direct + one level of indirect referrals (security definer)
-- ---------------------------------------------------------------------------
create or replace function public.get_my_team_profiles()
returns table (
  id uuid,
  full_name text,
  referred_by uuid
)
language sql
stable
security definer
set search_path = public
as $$
  with direct as (
    select p.id, p.full_name, p.referred_by
    from public.profiles p
    where p.referred_by = auth.uid()
  )
  select d.id, d.full_name, d.referred_by from direct d
  union all
  select p.id, p.full_name, p.referred_by
  from public.profiles p
  where p.referred_by in (select d.id from direct d);
$$;

revoke all on function public.get_my_team_profiles() from public;
grant execute on function public.get_my_team_profiles() to authenticated;

-- ---------------------------------------------------------------------------
-- Storage: private receipts bucket + policies
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'receipts',
  'receipts',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "receipts_insert_own" on storage.objects;
create policy "receipts_insert_own"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'receipts'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "receipts_select_own_or_admin" on storage.objects;
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

drop policy if exists "receipts_update_own_or_admin" on storage.objects;
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

drop policy if exists "receipts_delete_own_or_admin" on storage.objects;
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
