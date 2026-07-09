-- ============================================================
-- PERFORMUSCLE — Bloodwork Reference Library
-- Paste into Supabase SQL Editor and Run
--
-- Blood panel results themselves reuse the existing `test_results`
-- table (test_type = 'bloodwork_panel'), so no new table is needed
-- for that. This file only adds the coach-authored reference range
-- library that panel values are checked against.
-- ============================================================

create table if not exists bloodwork_markers (
  id uuid primary key default uuid_generate_v4(),
  coach_id uuid references profiles(id) on delete cascade,
  marker_key text not null,
  display_name text not null,
  unit text,
  category text not null default 'general',
  sex text check (sex in ('male','female')), -- null = applies to all clients
  conventional_low numeric,
  conventional_high numeric,
  optimal_low numeric,
  optimal_high numeric,
  notes text,
  sort_order integer default 0,
  created_at timestamptz default now(),
  unique (coach_id, marker_key, sex)
);

alter table bloodwork_markers enable row level security;

create policy "Coaches can manage own bloodwork markers"
  on bloodwork_markers for all using (coach_id = auth.uid());

create policy "Clients can view their coach's bloodwork markers"
  on bloodwork_markers for select using (
    exists (
      select 1 from clients
      where clients.coach_id = bloodwork_markers.coach_id
      and clients.client_id = auth.uid()
    )
  );

create index if not exists idx_bloodwork_markers_coach on bloodwork_markers(coach_id);
create index if not exists idx_bloodwork_markers_category on bloodwork_markers(category);

-- ── Phase 2 additions: PDF import matching + auto-assembled recommendations ──
-- Safe to re-run whether or not the table above already existed without these columns.
alter table bloodwork_markers add column if not exists rec_low text;   -- coach's own recommendation, shown when a value is below optimal
alter table bloodwork_markers add column if not exists rec_high text;  -- coach's own recommendation, shown when a value is above optimal
alter table bloodwork_markers add column if not exists aliases text;   -- comma-separated alternate lab names, improves PDF matching
