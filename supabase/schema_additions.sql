-- ============================================================
-- PERFORMUSCLE — Schema Additions
-- Paste into Supabase SQL Editor and Run
-- ============================================================

-- ── Test Results ────────────────────────────────────────────
create table if not exists test_results (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references profiles(id) on delete cascade,
  coach_id uuid references profiles(id),
  test_type text not null, -- 'vo2_cooper' | 'vo2_hr' | 'wingate' | '1rm' | 'body_comp' | 'mobility'
  tested_date date not null default current_date,
  results jsonb not null default '{}',
  coach_note text,
  created_at timestamptz default now()
);

alter table test_results enable row level security;

create policy "Clients can view own test results"
  on test_results for select
  using (client_id = auth.uid());

create policy "Coaches can manage client test results"
  on test_results for all
  using (
    exists (
      select 1 from clients
      where clients.coach_id = auth.uid()
      and clients.client_id = test_results.client_id
    )
  );

-- ── Education Modules ────────────────────────────────────────
create table if not exists education_modules (
  id uuid primary key default uuid_generate_v4(),
  coach_id uuid references profiles(id) on delete cascade,
  title text not null,
  category text not null default 'training', -- 'nutrition' | 'training' | 'recovery' | 'mindset' | 'programming'
  content_type text not null default 'article', -- 'video' | 'pdf' | 'article' | 'quiz'
  content_url text,       -- Supabase Storage URL for video/pdf
  article_body text,      -- rich text for articles
  thumbnail_url text,
  unlock_week integer not null default 0,  -- 0 = always visible
  assigned_to text not null default 'all', -- 'all' | 'elite' | 'standard' | specific client_id
  is_published boolean not null default true,
  order_index integer default 0,
  created_at timestamptz default now()
);

alter table education_modules enable row level security;

create policy "Clients can view published modules assigned to them"
  on education_modules for select
  using (
    is_published = true
    and (
      assigned_to = 'all'
      or assigned_to = (select plan from profiles where id = auth.uid())
      or assigned_to = auth.uid()::text
    )
  );

create policy "Coaches can manage their own modules"
  on education_modules for all
  using (coach_id = auth.uid());

-- ── Quiz Questions ────────────────────────────────────────────
create table if not exists quiz_questions (
  id uuid primary key default uuid_generate_v4(),
  module_id uuid references education_modules(id) on delete cascade,
  question text not null,
  options jsonb not null default '[]', -- array of { text, hint }
  correct_index integer not null default 0,
  explanation text,
  order_index integer not null default 0
);

alter table quiz_questions enable row level security;

create policy "Anyone authenticated can read quiz questions"
  on quiz_questions for select
  using (
    exists (
      select 1 from education_modules
      where education_modules.id = quiz_questions.module_id
      and education_modules.is_published = true
    )
  );

create policy "Coaches can manage quiz questions"
  on quiz_questions for all
  using (
    exists (
      select 1 from education_modules
      where education_modules.id = quiz_questions.module_id
      and education_modules.coach_id = auth.uid()
    )
  );

-- ── Module Completions ────────────────────────────────────────
create table if not exists module_completions (
  id uuid primary key default uuid_generate_v4(),
  module_id uuid references education_modules(id) on delete cascade,
  client_id uuid references profiles(id) on delete cascade,
  completed_at timestamptz default now(),
  quiz_score integer,  -- null for non-quiz types, 0-100 for quizzes
  unique (module_id, client_id)
);

alter table module_completions enable row level security;

create policy "Clients can manage own completions"
  on module_completions for all
  using (client_id = auth.uid());

create policy "Coaches can view client completions"
  on module_completions for select
  using (
    exists (
      select 1 from clients
      where clients.coach_id = auth.uid()
      and clients.client_id = module_completions.client_id
    )
  );

-- ── Indexes ──────────────────────────────────────────────────
create index if not exists idx_test_results_client on test_results(client_id);
create index if not exists idx_test_results_type on test_results(test_type);
create index if not exists idx_education_modules_coach on education_modules(coach_id);
create index if not exists idx_education_modules_category on education_modules(category);
create index if not exists idx_quiz_questions_module on quiz_questions(module_id);
create index if not exists idx_module_completions_client on module_completions(client_id);
create index if not exists idx_module_completions_module on module_completions(module_id);
