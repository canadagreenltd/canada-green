/*
=============================================================================
Canada Green — Real audit logs (admin activity feed)

  npm run db:migrate
=============================================================================
*/

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles (id) on delete set null,
  action text not null,
  detail text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_created_at_idx
  on public.audit_logs (created_at desc);
create index if not exists audit_logs_actor_id_idx
  on public.audit_logs (actor_id);

alter table public.audit_logs enable row level security;

drop policy if exists "audit_logs_select_admin" on public.audit_logs;
create policy "audit_logs_select_admin"
  on public.audit_logs
  for select
  to authenticated
  using (public.is_admin());

-- Inserts go through security definer helper (users cannot forge logs)
create or replace function public.write_audit_log(
  p_action text,
  p_detail text default '',
  p_actor_id uuid default auth.uid()
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
begin
  insert into public.audit_logs (actor_id, action, detail)
  values (p_actor_id, p_action, coalesce(p_detail, ''))
  returning id into new_id;
  return new_id;
end;
$$;

revoke all on function public.write_audit_log(text, text, uuid) from public;
grant execute on function public.write_audit_log(text, text, uuid) to authenticated;

-- Log new profile (signup)
create or replace function public.log_profile_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.write_audit_log(
    'Signup',
    'New account created',
    new.id
  );
  return new;
end;
$$;

drop trigger if exists on_profile_created_audit on public.profiles;
create trigger on_profile_created_audit
  after insert on public.profiles
  for each row
  execute function public.log_profile_created();
