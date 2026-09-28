/*
=============================================================================
Canada Green — Security hardening (apply after 001_auth.sql)

  npm run db:migrate

Fixes:
- Users cannot self-promote to admin or change referral fields
- Signup requires a valid referral code (unless skip_referral metadata for bootstrap admin)
- Direct referrals readable for future Team tab
=============================================================================
*/

-- Prevent clients from changing role / referral_code / referred_by
create or replace function public.protect_profile_immutable_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if coalesce(auth.jwt() ->> 'role', '') = 'service_role' then
    return new;
  end if;

  if new.role is distinct from old.role
     or new.referral_code is distinct from old.referral_code
     or new.referred_by is distinct from old.referred_by then
    raise exception 'Cannot modify protected profile fields';
  end if;

  return new;
end;
$$;

drop trigger if exists protect_profile_immutable_fields on public.profiles;
create trigger protect_profile_immutable_fields
  before update on public.profiles
  for each row
  execute function public.protect_profile_immutable_fields();

-- Tighten own-update policy (full_name / email only in practice; trigger enforces)
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Enforce valid referral on signup (admin bootstrap uses skip_referral=true)
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

-- Direct team members (people who used my referral code)
drop policy if exists "profiles_select_direct_referrals" on public.profiles;
create policy "profiles_select_direct_referrals"
  on public.profiles
  for select
  to authenticated
  using (referred_by = auth.uid());
