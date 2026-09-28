/*
=============================================================================
Canada Green — Auth / profiles migration (prototype)
=============================================================================

Apply automatically (preferred):

  npm run db:migrate
  # or the full setup:
  npm run setup:supabase

See SUPABASE_SETUP.md for env vars (SUPABASE_DB_URL, etc.).

Manual SQL Editor paste is no longer required.
=============================================================================
*/

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  email text not null default '',
  role text not null default 'user' check (role in ('user', 'admin')),
  referral_code text not null,
  referred_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  constraint profiles_referral_code_unique unique (referral_code)
);

create index if not exists profiles_referred_by_idx on public.profiles (referred_by);

-- Avoid RLS recursion when checking admin role
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

-- Auto-create profile on signup
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
begin
  -- 8-char alphanumeric referral code (unique)
  loop
    new_code := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 8));
    exit when not exists (
      select 1 from public.profiles where referral_code = new_code
    );
  end loop;

  incoming_code := nullif(trim(coalesce(new.raw_user_meta_data->>'referral_code', '')), '');
  if incoming_code is not null then
    select id into referrer_id
    from public.profiles
    where referral_code = upper(incoming_code)
    limit 1;
    -- if not found, referrer_id stays null — do not error
  end if;

  insert into public.profiles (id, full_name, email, referral_code, referred_by)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.email, ''),
    new_code,
    referrer_id
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "profiles_select_admin" on public.profiles;
create policy "profiles_select_admin"
  on public.profiles
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Allow reading the person who referred you (for dashboard "Referred by")
create or replace function public.get_my_referrer_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select referred_by from public.profiles where id = auth.uid();
$$;

revoke all on function public.get_my_referrer_id() from public;
grant execute on function public.get_my_referrer_id() to authenticated;

drop policy if exists "profiles_select_referrer" on public.profiles;
create policy "profiles_select_referrer"
  on public.profiles
  for select
  to authenticated
  using (id = public.get_my_referrer_id());
