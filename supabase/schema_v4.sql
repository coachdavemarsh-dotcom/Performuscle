-- ── schema_v4.sql ─────────────────────────────────────────────────────────────
-- Paste into Supabase SQL Editor to apply this migration.
-- Adds: gender, DOB, cycle fields to profiles; creates cycle_logs table + RLS.
-- ──────────────────────────────────────────────────────────────────────────────

-- ── Profiles — add gender, DOB, cycle fields ──────────────────────────────────
alter table profiles
  add column if not exists gender text check (gender in ('male','female','non_binary','prefer_not_to_say')),
  add column if not exists date_of_birth date,
  add column if not exists cycle_tracking_enabled boolean not null default false,
  add column if not exists cycle_length integer not null default 28,
  add column if not exists period_length integer not null default 5;

-- ── Cycle Logs ────────────────────────────────────────────────────────────────
create table if not exists cycle_logs (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references profiles(id) on delete cascade,
  log_date date not null,
  is_period_day boolean not null default false,
  period_start date,           -- set on first day of period
  flow_intensity text check (flow_intensity in ('spotting','light','medium','heavy')),
  symptoms jsonb not null default '{}',
  -- symptoms keys: energy(1-5), mood(great/good/neutral/low/irritable),
  --   cramping(none/mild/moderate/severe), bloating, headache,
  --   breast_tenderness, fatigue, cravings, sleep(1-5),
  --   training_feel(great/good/ok/poor/rest)
  notes text,
  created_at timestamptz default now(),
  unique (client_id, log_date)
);

alter table cycle_logs enable row level security;

create policy "Clients can manage own cycle logs"
  on cycle_logs for all
  using (client_id = auth.uid());

create policy "Coaches can view client cycle logs"
  on cycle_logs for select
  using (
    exists (
      select 1 from clients
      where clients.coach_id = auth.uid()
      and clients.client_id = cycle_logs.client_id
    )
  );

create index if not exists idx_cycle_logs_client_date on cycle_logs(client_id, log_date desc);
