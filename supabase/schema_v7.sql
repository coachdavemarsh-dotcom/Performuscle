-- ============================================================
-- SCHEMA V7 — Conditioning logs
-- Run in Supabase SQL Editor AFTER schema_v6.sql
-- ============================================================

create table if not exists conditioning_logs (
  id           uuid primary key default uuid_generate_v4(),
  session_id   uuid references sessions(id) on delete cascade,
  client_id    uuid references profiles(id) on delete cascade,
  result       jsonb,     -- rounds, time, splits, per-station results
  notes        text,
  logged_at    timestamptz default now(),
  unique (session_id, client_id)
);

alter table conditioning_logs enable row level security;

create policy "Clients can manage own conditioning logs"
  on conditioning_logs for all using (auth.uid() = client_id);

create policy "Coaches can view client conditioning logs"
  on conditioning_logs for select using (
    exists (
      select 1 from sessions
      join programs on programs.id = sessions.program_id
      where sessions.id = conditioning_logs.session_id
        and programs.coach_id = auth.uid()
    )
  );

-- Also add movement_prep to sessions if not present (schema_v1 may be missing it)
alter table sessions
  add column if not exists movement_prep jsonb;
