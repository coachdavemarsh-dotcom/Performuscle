-- ============================================================
-- SCHEMA V5 — Client onboarding fields
-- Run in Supabase SQL Editor
-- ============================================================

alter table profiles
  add column if not exists onboarding_complete  boolean       default false,
  add column if not exists date_of_birth        date,
  add column if not exists gender               text,
  add column if not exists height_cm            numeric,
  add column if not exists current_weight       numeric,
  add column if not exists goal_type            text,          -- 'cut' | 'gain' | 'maintain' | 'recomp'
  add column if not exists target_weight        numeric,
  add column if not exists activity_level       text,          -- 'sedentary' | 'light' | 'moderate' | 'active' | 'athlete'
  add column if not exists training_experience  text,          -- 'beginner' | 'intermediate' | 'advanced'
  add column if not exists occupation           text,
  add column if not exists sleep_hours          numeric,
  add column if not exists stress_level         integer,       -- 1-5
  add column if not exists injuries             text,
  add column if not exists cycle_tracking_enabled boolean      default false,
  add column if not exists cycle_length         integer        default 28,
  add column if not exists period_length        integer        default 5,
  add column if not exists waist_cm             numeric,
  add column if not exists neck_cm              numeric,
  add column if not exists hips_cm              numeric;

-- Coaches skip onboarding
update profiles set onboarding_complete = true where is_coach = true;
