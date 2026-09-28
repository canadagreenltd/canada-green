/*
=============================================================================
Canada Green — Payment plan tenure (18 months)

  npm run db:migrate

- starts_at / ends_at set when admin approves a payment
- amount must be a whole number >= 100
=============================================================================
*/

alter table public.payment_submissions
  add column if not exists starts_at timestamptz,
  add column if not exists ends_at timestamptz;

-- Enforce whole-number amounts (>= 100 already on column check)
alter table public.payment_submissions
  drop constraint if exists payment_submissions_amount_cad_check;

alter table public.payment_submissions
  add constraint payment_submissions_amount_cad_check
  check (
    amount_cad >= 100
    and amount_cad = trunc(amount_cad)
  );

create index if not exists payment_submissions_ends_at_idx
  on public.payment_submissions (ends_at)
  where status = 'active';
