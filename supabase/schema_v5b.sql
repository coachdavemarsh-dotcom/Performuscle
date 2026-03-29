-- ============================================================
-- SCHEMA V5b — Client assessment submissions
-- Run in Supabase SQL Editor after schema_v5.sql
-- ============================================================

create table if not exists client_assessments (
  id          uuid primary key default uuid_generate_v4(),
  client_id   uuid references profiles(id) on delete cascade,
  assessed_at timestamptz default now(),
  posture     jsonb default '{}',   -- { front_url, back_url, side_url, notes }
  fms         jsonb default '{}',   -- { deep_squat: { score, notes, video_url }, ... }
  rom         jsonb default '{}',   -- { hip: { flex_l, flex_r, ... }, shoulder: {...}, spine: {...} }
  coach_notes text
);

alter table client_assessments enable row level security;

create policy "client insert own assessment"
  on client_assessments for insert
  with check (auth.uid() = client_id);

create policy "client read own assessment"
  on client_assessments for select
  using (auth.uid() = client_id);

create policy "client update own assessment"
  on client_assessments for update
  using (auth.uid() = client_id);

create policy "coach read all assessments"
  on client_assessments for select
  using (exists (select 1 from profiles where id = auth.uid() and is_coach = true));

create policy "coach update assessments"
  on client_assessments for update
  using (exists (select 1 from profiles where id = auth.uid() and is_coach = true));

create index if not exists idx_client_assessments_client on client_assessments(client_id);

-- ── Storage buckets ─────────────────────────────────────────
-- Run these if the buckets don't already exist
insert into storage.buckets (id, name, public)
  values ('assessment-photos', 'assessment-photos', false)
  on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
  values ('assessment-videos', 'assessment-videos', false)
  on conflict (id) do nothing;

-- Storage policies
create policy "client upload own assessment photos"
  on storage.objects for insert
  with check (bucket_id = 'assessment-photos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "client read own assessment photos"
  on storage.objects for select
  using (bucket_id = 'assessment-photos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "coach read all assessment photos"
  on storage.objects for select
  using (
    bucket_id in ('assessment-photos', 'assessment-videos')
    and exists (select 1 from profiles where id = auth.uid() and is_coach = true)
  );

create policy "client upload own assessment videos"
  on storage.objects for insert
  with check (bucket_id = 'assessment-videos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "client read own assessment videos"
  on storage.objects for select
  using (bucket_id = 'assessment-videos' and auth.uid()::text = (storage.foldername(name))[1]);
