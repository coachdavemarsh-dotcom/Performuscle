-- Movement screen. Paste into Supabase > SQL Editor > Run. Safe to run more than once.
-- Part 1: the table that holds each client's screen.
create table if not exists public.movement_screens (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null check (char_length(email) between 3 and 320),
  name text check (name is null or char_length(name) < 200),
  upload_id text check (upload_id is null or char_length(upload_id) < 100),
  tests jsonb not null default '{}'::jsonb check (pg_column_size(tests) < 100000),
  files jsonb not null default '[]'::jsonb check (pg_column_size(files) < 100000),
  status text not null default 'new',
  coach_data jsonb
);
create index if not exists movement_screens_email_idx on public.movement_screens (lower(email));
alter table public.movement_screens enable row level security;
drop policy if exists "Public can submit screens" on public.movement_screens;
create policy "Public can submit screens" on public.movement_screens for insert to anon, authenticated
  with check (status = 'new' and coach_data is null);
drop policy if exists "Coaches read screens" on public.movement_screens;
create policy "Coaches read screens" on public.movement_screens for select to authenticated
  using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.is_coach));
drop policy if exists "Coaches update screens" on public.movement_screens;
create policy "Coaches update screens" on public.movement_screens for update to authenticated
  using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.is_coach))
  with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.is_coach));

-- Part 2: let the existing private audit-uploads folder take short videos (up to 50 MB).
-- It already lets clients upload and only you view. If this line errors, do it in
-- Storage > audit-uploads > Edit bucket instead (see the steps in the chat).
update storage.buckets
   set file_size_limit = 52428800,
       allowed_mime_types = array['application/pdf','image/jpeg','image/png','image/heic','image/heif','image/webp','video/mp4','video/quicktime','video/webm','video/3gpp']
 where id = 'audit-uploads';
