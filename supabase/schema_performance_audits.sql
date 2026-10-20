-- Performance Audit submissions from coachdavemarsh.net/audit
-- Applied to the live project on 2026-10-20 (migration: create_performance_audits).
create table if not exists public.performance_audits (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null check (char_length(full_name) between 1 and 200),
  email text not null check (char_length(email) between 3 and 320),
  phone text check (char_length(phone) <= 50),
  consent boolean not null default false check (consent = true),
  answers jsonb not null default '{}'::jsonb check (pg_column_size(answers) < 200000),
  status text not null default 'new' check (status in ('new','reviewed','booked','client','archived')),
  coach_data jsonb,
  source text not null default 'website-audit'
);
alter table public.performance_audits enable row level security;
-- Website visitors can submit, never read.
create policy "Public can submit audits" on public.performance_audits for insert
  to anon, authenticated with check (status = 'new' and coach_data is null);
-- Only coach accounts (profiles.is_coach) can read and update.
create policy "Coaches can read audits" on public.performance_audits for select
  to authenticated using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.is_coach));
create policy "Coaches can update audits" on public.performance_audits for update
  to authenticated using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.is_coach))
  with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.is_coach));
create index if not exists performance_audits_created_at_idx on public.performance_audits (created_at desc);
create index if not exists performance_audits_status_idx on public.performance_audits (status);
