-- Movement screen: client uploads after the Performance Audit, read by the coach dashboard.
-- Paste into Supabase > SQL Editor > Run. Safe to run more than once.
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

-- Private bucket for the clips: anyone can upload, only coaches can view. 50 MB per file.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('screen-uploads', 'screen-uploads', false, 52428800,
  array['video/mp4','video/quicktime','video/webm','video/3gpp','image/jpeg','image/png','image/heic','image/heif','image/webp','application/pdf'])
on conflict (id) do update set file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types, public = false;
drop policy if exists "Public can upload screen files" on storage.objects;
create policy "Public can upload screen files" on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'screen-uploads');
drop policy if exists "Coaches can read screen files" on storage.objects;
create policy "Coaches can read screen files" on storage.objects for select to authenticated
  using (bucket_id = 'screen-uploads' and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.is_coach));
