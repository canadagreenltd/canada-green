/*
=============================================================================
Canada Green — Referral commissions + deeper team tree

- One-time commission on payment approve: 5% direct (L1), 1% indirect (L2+)
- Max depth 5 by default; 10 if beneficiary has >= 5 direct referrals
- Expand get_my_team_profiles to 10 levels for Team tab tree

  npm run db:migrate
=============================================================================
*/

-- ---------------------------------------------------------------------------
-- referral_commissions ledger
-- ---------------------------------------------------------------------------
create table if not exists public.referral_commissions (
  id uuid primary key default gen_random_uuid(),
  beneficiary_id uuid not null references public.profiles (id) on delete cascade,
  source_user_id uuid not null references public.profiles (id) on delete cascade,
  payment_submission_id uuid not null references public.payment_submissions (id) on delete cascade,
  level int not null check (level >= 1 and level <= 10),
  rate numeric(8, 4) not null check (rate > 0),
  amount_cad numeric(14, 2) not null check (amount_cad >= 0),
  created_at timestamptz not null default now(),
  constraint referral_commissions_payment_beneficiary_unique
    unique (payment_submission_id, beneficiary_id)
);

create index if not exists referral_commissions_beneficiary_idx
  on public.referral_commissions (beneficiary_id, created_at desc);
create index if not exists referral_commissions_payment_idx
  on public.referral_commissions (payment_submission_id);
create index if not exists referral_commissions_source_idx
  on public.referral_commissions (source_user_id);

alter table public.referral_commissions enable row level security;

drop policy if exists "referral_commissions_select_own" on public.referral_commissions;
create policy "referral_commissions_select_own"
  on public.referral_commissions
  for select
  to authenticated
  using (beneficiary_id = auth.uid());

drop policy if exists "referral_commissions_select_admin" on public.referral_commissions;
create policy "referral_commissions_select_admin"
  on public.referral_commissions
  for select
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Distribute commissions when a payment becomes active
-- ---------------------------------------------------------------------------
create or replace function public.distribute_referral_commissions(p_payment_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_amount numeric(14, 2);
  v_status text;
  v_current uuid;
  v_level int := 0;
  v_ancestor uuid;
  v_direct_count int;
  v_max_depth int;
  v_rate numeric(8, 4);
  v_commission numeric(14, 2);
begin
  select user_id, amount_cad, status
    into v_user_id, v_amount, v_status
  from public.payment_submissions
  where id = p_payment_id;

  if v_user_id is null then
    return;
  end if;

  if v_status is distinct from 'active' then
    return;
  end if;

  -- Idempotent: already distributed for this payment
  if exists (
    select 1 from public.referral_commissions
    where payment_submission_id = p_payment_id
  ) then
    return;
  end if;

  v_current := v_user_id;

  loop
    select referred_by into v_ancestor
    from public.profiles
    where id = v_current;

    exit when v_ancestor is null;

    v_level := v_level + 1;
    exit when v_level > 10;

    select count(*)::int into v_direct_count
    from public.profiles
    where referred_by = v_ancestor;

    v_max_depth := case when v_direct_count >= 5 then 10 else 5 end;

    if v_level > v_max_depth then
      -- Deeper ancestors are even farther; stop walking
      exit;
    end if;

    v_rate := case when v_level = 1 then 0.05 else 0.01 end;
    v_commission := round(v_amount * v_rate, 2);

    insert into public.referral_commissions (
      beneficiary_id,
      source_user_id,
      payment_submission_id,
      level,
      rate,
      amount_cad
    )
    values (
      v_ancestor,
      v_user_id,
      p_payment_id,
      v_level,
      v_rate,
      v_commission
    )
    on conflict (payment_submission_id, beneficiary_id) do nothing;

    v_current := v_ancestor;
  end loop;
end;
$$;

revoke all on function public.distribute_referral_commissions(uuid) from public;
grant execute on function public.distribute_referral_commissions(uuid) to authenticated;

create or replace function public.trigger_distribute_referral_commissions()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'active' and (tg_op = 'INSERT' or old.status is distinct from 'active') then
    perform public.distribute_referral_commissions(new.id);
  end if;
  return new;
end;
$$;

drop trigger if exists on_payment_active_referral_commissions on public.payment_submissions;
create trigger on_payment_active_referral_commissions
  after insert or update of status on public.payment_submissions
  for each row
  execute function public.trigger_distribute_referral_commissions();

-- ---------------------------------------------------------------------------
-- Team tree: up to 10 levels under the current user
-- ---------------------------------------------------------------------------
drop function if exists public.get_my_team_profiles();

create or replace function public.get_my_team_profiles()
returns table (
  id uuid,
  full_name text,
  referred_by uuid,
  depth int
)
language sql
stable
security definer
set search_path = public
as $$
  with recursive tree as (
    select
      p.id,
      p.full_name,
      p.referred_by,
      1 as depth
    from public.profiles p
    where p.referred_by = auth.uid()

    union all

    select
      c.id,
      c.full_name,
      c.referred_by,
      t.depth + 1
    from public.profiles c
    inner join tree t on c.referred_by = t.id
    where t.depth < 10
  )
  select tree.id, tree.full_name, tree.referred_by, tree.depth
  from tree
  order by tree.depth, tree.full_name;
$$;

revoke all on function public.get_my_team_profiles() from public;
grant execute on function public.get_my_team_profiles() to authenticated;
