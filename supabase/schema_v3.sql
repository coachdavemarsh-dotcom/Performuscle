-- ============================================================
-- PERFORMUSCLE — Schema v3 Migrations
-- Paste into Supabase SQL Editor and Run
-- ============================================================

-- ── Exercises — add missing columns ──────────────────────────
alter table exercises
  add column if not exists tempo text,          -- e.g. '4010'
  add column if not exists pairing text,        -- e.g. 'A', 'B' for supersets
  add column if not exists video_url text;      -- YouTube/Vimeo URL for demo

-- ── Sessions — add movement prep ─────────────────────────────
alter table sessions
  add column if not exists movement_prep jsonb default '[]';
-- movement_prep is an array of:
-- { id, name, sets, reps, duration, notes, video_url }

-- ── Programs — add goal map fields ───────────────────────────
alter table programs
  add column if not exists goal_type text default 'maintain'
    check (goal_type in ('cut','aggressive_cut','gain','lean_gain','maintain','recomp')),
  add column if not exists start_weight numeric(5,2),  -- kg at programme start
  add column if not exists target_weight numeric(5,2), -- kg goal
  add column if not exists start_date date,            -- programme start date
  add column if not exists phases jsonb default '[]';  -- custom periodisation phases
-- phases is an array of:
-- { name, weeks, color, focus, goal }

-- ── Measurements — ensure body_fat_pct exists ────────────────
alter table measurements
  add column if not exists body_fat_pct numeric(4,1),
  add column if not exists lean_mass_kg numeric(5,2),
  add column if not exists fat_mass_kg  numeric(5,2);

-- ── Indexes ───────────────────────────────────────────────────
create index if not exists idx_exercises_session on exercises(session_id);
create index if not exists idx_exercises_pairing on exercises(pairing);
create index if not exists idx_programs_goal_type on programs(goal_type);
create index if not exists idx_measurements_client on measurements(client_id);
