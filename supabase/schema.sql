-- Performuscle Database Schema
-- Run this entire file in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
create table if not exists profiles (
  id uuid references auth.users primary key,
  full_name text,
  is_coach boolean default false,
  plan text check (plan in ('elite', 'standard')),
  check_in_day text check (check_in_day in ('monday','tuesday','wednesday','thursday','friday','saturday','sunday')),
  height_cm numeric,
  gender text check (gender in ('male','female')),
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

-- ============================================================
-- CLIENTS
-- ============================================================
create table if not exists clients (
  id uuid primary key default uuid_generate_v4(),
  coach_id uuid references profiles(id) on delete cascade,
  client_id uuid references profiles(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan text check (plan in ('elite', 'standard')),
  monthly_price numeric,
  status text default 'active' check (status in ('active','paused','cancelled')),
  created_at timestamptz default now(),
  unique (coach_id, client_id)
);

alter table clients enable row level security;

create policy "Coaches can manage their clients"
  on clients for all using (auth.uid() = coach_id);

create policy "Clients can view own record"
  on clients for select using (auth.uid() = client_id);

-- ============================================================
-- PROGRAMS
-- ============================================================
create table if not exists programs (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references profiles(id) on delete cascade,
  coach_id uuid references profiles(id) on delete cascade,
  name text not null,
  total_weeks integer not null,
  current_week integer default 1,
  phase text,
  goal_type text,
  start_weight numeric,
  target_weight numeric,
  start_date date,
  end_date date,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table programs enable row level security;

create policy "Coaches can manage programs"
  on programs for all using (auth.uid() = coach_id);

create policy "Clients can view own programs"
  on programs for select using (auth.uid() = client_id);

-- ============================================================
-- SESSIONS
-- ============================================================
create table if not exists sessions (
  id uuid primary key default uuid_generate_v4(),
  program_id uuid references programs(id) on delete cascade,
  client_id uuid references profiles(id) on delete cascade,
  week_number integer,
  day_label text,
  session_type text,
  movement_prep jsonb default '[]'::jsonb,
  conditioning_config jsonb,
  is_completed boolean default false,
  completed_at timestamptz,
  created_at timestamptz default now()
);

alter table sessions enable row level security;

create policy "Clients can view and update own sessions"
  on sessions for all using (auth.uid() = client_id);

create policy "Coaches can manage client sessions"
  on sessions for all using (
    exists (
      select 1 from programs
      where programs.id = sessions.program_id and programs.coach_id = auth.uid()
    )
  );

-- ============================================================
-- EXERCISES
-- ============================================================
create table if not exists exercises (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid references sessions(id) on delete cascade,
  name text not null,
  set_count integer default 3,
  rep_scheme text,
  set_type text default 'standard' check (set_type in ('standard','amrap','drop','rest_pause','failure')),
  tempo text,
  rest_seconds integer,
  coach_note text,
  pairing text,
  video_url text,
  order_index integer default 0,
  created_at timestamptz default now()
);

alter table exercises enable row level security;

create policy "Clients can view exercises in own sessions"
  on exercises for select using (
    exists (
      select 1 from sessions
      where sessions.id = exercises.session_id and sessions.client_id = auth.uid()
    )
  );

create policy "Coaches can manage exercises"
  on exercises for all using (
    exists (
      select 1 from sessions
      join programs on programs.id = sessions.program_id
      where sessions.id = exercises.session_id and programs.coach_id = auth.uid()
    )
  );

-- ============================================================
-- SET LOGS
-- ============================================================
create table if not exists set_logs (
  id uuid primary key default uuid_generate_v4(),
  exercise_id uuid references exercises(id) on delete cascade,
  client_id uuid references profiles(id) on delete cascade,
  set_number integer,
  weight_kg numeric,
  reps integer,
  rpe numeric check (rpe >= 6 and rpe <= 10),
  rir integer check (rir >= 0 and rir <= 5),
  is_completed boolean default false,
  logged_at timestamptz default now()
);

alter table set_logs enable row level security;

create policy "Clients can manage own set logs"
  on set_logs for all using (auth.uid() = client_id);

create policy "Coaches can view client set logs"
  on set_logs for select using (
    exists (
      select 1 from clients
      where clients.coach_id = auth.uid() and clients.client_id = set_logs.client_id
    )
  );

-- ============================================================
-- CHECK-INS
-- ============================================================
create table if not exists check_ins (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references profiles(id) on delete cascade,
  coach_id uuid references profiles(id),
  week_number integer,
  submitted_at timestamptz default now(),
  body_weight_kg numeric,
  sleep_hrs numeric,
  training_score integer check (training_score between 1 and 5),
  nutrition_score integer check (nutrition_score between 1 and 5),
  mood_score integer check (mood_score between 1 and 5),
  client_note text,
  coach_reply text,
  replied_at timestamptz,
  photos jsonb default '{}'::jsonb
);

alter table check_ins enable row level security;

create policy "Clients can manage own check-ins"
  on check_ins for all using (auth.uid() = client_id);

create policy "Coaches can view and reply to client check-ins"
  on check_ins for all using (auth.uid() = coach_id);

-- ============================================================
-- NUTRITION LOGS
-- ============================================================
create table if not exists nutrition_logs (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references profiles(id) on delete cascade,
  logged_date date not null,
  day_type text check (day_type in ('training','moderate','rest')),
  meals jsonb default '[]'::jsonb,
  total_kcal numeric default 0,
  total_protein_g numeric default 0,
  total_carbs_g numeric default 0,
  total_fat_g numeric default 0,
  created_at timestamptz default now(),
  unique (client_id, logged_date)
);

alter table nutrition_logs enable row level security;

create policy "Clients can manage own nutrition logs"
  on nutrition_logs for all using (auth.uid() = client_id);

create policy "Coaches can view client nutrition logs"
  on nutrition_logs for select using (
    exists (
      select 1 from clients
      where clients.coach_id = auth.uid() and clients.client_id = nutrition_logs.client_id
    )
  );

-- ============================================================
-- HABIT LOGS
-- ============================================================
create table if not exists habit_logs (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references profiles(id) on delete cascade,
  logged_date date not null,
  steps integer,
  sleep_hrs numeric,
  energy_score integer check (energy_score between 1 and 5),
  hunger_score integer check (hunger_score between 1 and 5),
  stress_score integer check (stress_score between 1 and 5),
  created_at timestamptz default now(),
  unique (client_id, logged_date)
);

alter table habit_logs enable row level security;

create policy "Clients can manage own habit logs"
  on habit_logs for all using (auth.uid() = client_id);

create policy "Coaches can view client habit logs"
  on habit_logs for select using (
    exists (
      select 1 from clients
      where clients.coach_id = auth.uid() and clients.client_id = habit_logs.client_id
    )
  );

-- ============================================================
-- MEASUREMENTS
-- ============================================================
create table if not exists measurements (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references profiles(id) on delete cascade,
  measured_date date not null,
  body_weight_kg numeric,
  neck_cm numeric,
  waist_cm numeric,
  hips_cm numeric,
  chest_cm numeric,
  arm_l_cm numeric,
  arm_r_cm numeric,
  thigh_l_cm numeric,
  thigh_r_cm numeric,
  bf_percent numeric,
  lean_mass_kg numeric,
  created_at timestamptz default now()
);

alter table measurements enable row level security;

create policy "Clients can manage own measurements"
  on measurements for all using (auth.uid() = client_id);

create policy "Coaches can view client measurements"
  on measurements for select using (
    exists (
      select 1 from clients
      where clients.coach_id = auth.uid() and clients.client_id = measurements.client_id
    )
  );

-- ============================================================
-- NUTRITION PLANS
-- ============================================================
create table if not exists nutrition_plans (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references profiles(id) on delete cascade,
  coach_id uuid references profiles(id),
  day_types jsonb default '[]'::jsonb,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table nutrition_plans enable row level security;

create policy "Coaches can manage nutrition plans"
  on nutrition_plans for all using (auth.uid() = coach_id);

create policy "Clients can view own nutrition plans"
  on nutrition_plans for select using (auth.uid() = client_id);

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists idx_clients_coach on clients(coach_id);
create index if not exists idx_clients_client on clients(client_id);
create index if not exists idx_programs_client on programs(client_id);
create index if not exists idx_sessions_program on sessions(program_id);
create index if not exists idx_sessions_client on sessions(client_id);
create index if not exists idx_exercises_session on exercises(session_id);
create index if not exists idx_set_logs_exercise on set_logs(exercise_id);
create index if not exists idx_set_logs_client on set_logs(client_id);
create index if not exists idx_check_ins_client on check_ins(client_id);
create index if not exists idx_check_ins_coach on check_ins(coach_id);
create index if not exists idx_nutrition_logs_client_date on nutrition_logs(client_id, logged_date);
create index if not exists idx_habit_logs_client_date on habit_logs(client_id, logged_date);
create index if not exists idx_measurements_client_date on measurements(client_id, measured_date);

-- ============================================================
-- CYCLE TRACKING — profile columns + daily log table
-- ============================================================

-- Add cycle tracking columns to profiles
alter table profiles
  add column if not exists cycle_tracking_enabled boolean default false,
  add column if not exists cycle_length integer default 28,
  add column if not exists period_length integer default 5;

-- Daily cycle log (one row per client per day)
create table if not exists cycle_logs (
  id            uuid primary key default uuid_generate_v4(),
  client_id     uuid references profiles(id) on delete cascade,
  log_date      date not null,
  is_period_day boolean default false,
  period_start  date,
  symptoms      jsonb default '{}'::jsonb,
  notes         text,
  created_at    timestamptz default now(),
  unique (client_id, log_date)
);

alter table cycle_logs enable row level security;

create policy "Clients can manage own cycle logs"
  on cycle_logs for all using (auth.uid() = client_id);

create policy "Coaches can view client cycle logs"
  on cycle_logs for select using (
    exists (
      select 1 from clients
      where clients.coach_id = auth.uid() and clients.client_id = cycle_logs.client_id
    )
  );

create index if not exists idx_cycle_logs_client_date on cycle_logs(client_id, log_date desc);
