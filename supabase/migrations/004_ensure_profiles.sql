/*
=============================================================================
Canada Green — Repair missing profiles + ensure on login

  npm run db:migrate

Problem: auth.users can exist without public.profiles (e.g. users created
before the trigger, or signups that skipped metadata). Login then works
but the dashboard sees no profile.

Fix:
- Backfill any orphan auth users into profiles
- ensure_my_profile() RPC so login/callback can self-heal
=============================================================================
*/

-- Self-heal: create profile for the current auth user if missing
create or replace function public.ensure_my_profile()
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  existing public.profiles;
  meta jsonb;
  new_code text;
  referrer_id uuid;
  incoming_code text;
  admin_id uuid;
  user_email text;
  user_name text;
begin
  if uid is null then
    raise exception 'Not authenticated';
  end if;

  select * into existing from public.profiles where id = uid;
  if found then
    return existing;
  end if;

  select raw_user_meta_data, email
    into meta, user_email
  from auth.users
  where id = uid;

  user_name := coalesce(meta->>'full_name', '');

  loop
    new_code := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 8));
    exit when not exists (
      select 1 from public.profiles where referral_code = new_code
    );
  end loop;

  incoming_code := nullif(trim(coalesce(meta->>'referral_code', '')), '');
  if incoming_code is not null then
    select id into referrer_id
    from public.profiles
    where referral_code = upper(incoming_code)
    limit 1;
  end if;

  -- Repair path: if no valid referral in metadata, attach under first admin
  if referrer_id is null then
    select id into admin_id
    from public.profiles
    where role = 'admin'
    order by created_at asc
    limit 1;
    referrer_id := admin_id;
  end if;

  insert into public.profiles (id, full_name, email, role, referral_code, referred_by)
  values (
    uid,
    user_name,
    coalesce(user_email, ''),
    'user',
    new_code,
    referrer_id
  )
  returning * into existing;

  return existing;
end;
$$;

revoke all on function public.ensure_my_profile() from public;
grant execute on function public.ensure_my_profile() to authenticated;

-- One-time backfill for existing auth users missing a profile
do $$
declare
  r record;
  new_code text;
  admin_id uuid;
  referrer_id uuid;
  incoming_code text;
begin
  select id into admin_id
  from public.profiles
  where role = 'admin'
  order by created_at asc
  limit 1;

  for r in
    select u.id, u.email, u.raw_user_meta_data
    from auth.users u
    left join public.profiles p on p.id = u.id
    where p.id is null
  loop
    loop
      new_code := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 8));
      exit when not exists (
        select 1 from public.profiles where referral_code = new_code
      );
    end loop;

    referrer_id := null;
    incoming_code := nullif(trim(coalesce(r.raw_user_meta_data->>'referral_code', '')), '');
    if incoming_code is not null then
      select id into referrer_id
      from public.profiles
      where referral_code = upper(incoming_code)
      limit 1;
    end if;
    if referrer_id is null then
      referrer_id := admin_id;
    end if;

    insert into public.profiles (id, full_name, email, role, referral_code, referred_by)
    values (
      r.id,
      coalesce(r.raw_user_meta_data->>'full_name', ''),
      coalesce(r.email, ''),
      'user',
      new_code,
      referrer_id
    )
    on conflict (id) do nothing;
  end loop;
end;
$$;
