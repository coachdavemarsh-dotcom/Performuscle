-- Client Hub: per-client training progress, and coach-managed video links.
-- Run once in Supabase → SQL Editor → New query → paste → Run.

create table if not exists public.client_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  email text not null,
  module text not null check (char_length(module) between 1 and 40),
  data jsonb not null default '{}'::jsonb check (pg_column_size(data) < 200000),
  updated_at timestamptz not null default now(),
  unique (user_id, module)
);
create index if not exists client_progress_email_idx on public.client_progress (lower(email));
alter table public.client_progress enable row level security;

drop policy if exists "Clients manage their own progress" on public.client_progress;
create policy "Clients manage their own progress" on public.client_progress for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()) and lower(email) = lower((select auth.jwt() ->> 'email')));
drop policy if exists "Coaches read all progress" on public.client_progress;
create policy "Coaches read all progress" on public.client_progress for select to authenticated
  using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.is_coach));

create or replace function public.touch_client_progress() returns trigger
language plpgsql set search_path = public as $$ begin new.updated_at = now(); return new; end; $$;
drop trigger if exists client_progress_touch on public.client_progress;
create trigger client_progress_touch before update on public.client_progress
  for each row execute function public.touch_client_progress();

create table if not exists public.hub_content (
  module text primary key check (char_length(module) between 1 and 40),
  video_url text check (video_url is null or char_length(video_url) < 600),
  minutes integer check (minutes is null or minutes between 1 and 120),
  updated_at timestamptz not null default now()
);
alter table public.hub_content enable row level security;
drop policy if exists "Signed-in users read hub content" on public.hub_content;
create policy "Signed-in users read hub content" on public.hub_content for select to authenticated using (true);
drop policy if exists "Coaches manage hub content" on public.hub_content;
create policy "Coaches manage hub content" on public.hub_content for all to authenticated
  using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.is_coach))
  with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.is_coach));
