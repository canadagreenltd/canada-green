/*
=============================================================================
Canada Green — Admin-granted user reward badges

  npm run db:migrate
=============================================================================
*/

create table if not exists public.user_rewards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  tier text not null
    check (tier in ('bronze', 'silver', 'gold', 'diamond', 'platinum')),
  note text not null default '',
  granted_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  constraint user_rewards_user_tier_unique unique (user_id, tier)
);

create index if not exists user_rewards_user_id_idx
  on public.user_rewards (user_id, created_at desc);

alter table public.user_rewards enable row level security;

drop policy if exists "user_rewards_select_own" on public.user_rewards;
create policy "user_rewards_select_own"
  on public.user_rewards
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "user_rewards_select_admin" on public.user_rewards;
create policy "user_rewards_select_admin"
  on public.user_rewards
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists "user_rewards_insert_admin" on public.user_rewards;
create policy "user_rewards_insert_admin"
  on public.user_rewards
  for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "user_rewards_delete_admin" on public.user_rewards;
create policy "user_rewards_delete_admin"
  on public.user_rewards
  for delete
  to authenticated
  using (public.is_admin());
