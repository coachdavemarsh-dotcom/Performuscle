-- ============================================================
-- SCHEMA V9 — Education / Learning Hub progress tracking
-- ============================================================

create table if not exists education_progress (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references profiles(id) on delete cascade,
  course_id text not null,
  module_id text not null,
  completed boolean default false,
  quiz_score integer,
  quiz_attempts integer default 0,
  completed_at timestamptz,
  created_at timestamptz default now(),
  unique (client_id, course_id, module_id)
);

alter table education_progress enable row level security;

create policy "Clients can manage own education progress"
  on education_progress for all using (auth.uid() = client_id);

create policy "Coaches can view client education progress"
  on education_progress for select using (
    exists (
      select 1 from clients
      where clients.coach_id = auth.uid() and clients.client_id = education_progress.client_id
    )
  );

create index if not exists idx_education_progress_client on education_progress(client_id);
