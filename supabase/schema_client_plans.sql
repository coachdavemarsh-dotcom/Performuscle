-- My Plan: published client plans and client-uploaded files.
-- Run once in Supabase → SQL Editor → New query → paste → Run.

-- Published client plans (My Plan dashboard)
create table if not exists public.client_plans (
  id uuid primary key default gen_random_uuid(),
  audit_id uuid not null unique references public.performance_audits(id) on delete cascade,
  email text not null check (char_length(email) between 3 and 320),
  plan jsonb not null default '{}'::jsonb check (pg_column_size(plan) < 300000),
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists client_plans_email_idx on public.client_plans (lower(email));
alter table public.client_plans enable row level security;

drop policy if exists "Coaches manage client plans" on public.client_plans;
create policy "Coaches manage client plans" on public.client_plans for all to authenticated
  using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.is_coach))
  with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.is_coach));
drop policy if exists "Clients read their own published plan" on public.client_plans;
create policy "Clients read their own published plan" on public.client_plans for select to authenticated
  using (published and lower(email) = lower((select auth.jwt() ->> 'email')));

create or replace function public.touch_client_plans() returns trigger
language plpgsql set search_path = public as $$ begin new.updated_at = now(); return new; end; $$;
drop trigger if exists client_plans_touch on public.client_plans;
create trigger client_plans_touch before update on public.client_plans
  for each row execute function public.touch_client_plans();

-- Files clients upload from their dashboard (e.g. updated blood work)
create table if not exists public.client_files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  email text not null,
  name text not null check (char_length(name) between 1 and 200),
  path text not null unique,
  size integer,
  kind text not null default 'bloods',
  created_at timestamptz not null default now()
);
create index if not exists client_files_email_idx on public.client_files (lower(email));
alter table public.client_files enable row level security;

drop policy if exists "Clients add their own files" on public.client_files;
create policy "Clients add their own files" on public.client_files for insert to authenticated
  with check (user_id = (select auth.uid()) and lower(email) = lower((select auth.jwt() ->> 'email'))
              and path like 'clients/' || (select auth.uid())::text || '/%');
drop policy if exists "Clients see their own files" on public.client_files;
create policy "Clients see their own files" on public.client_files for select to authenticated
  using (user_id = (select auth.uid()));
drop policy if exists "Coaches see all client files" on public.client_files;
create policy "Coaches see all client files" on public.client_files for select to authenticated
  using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.is_coach));
