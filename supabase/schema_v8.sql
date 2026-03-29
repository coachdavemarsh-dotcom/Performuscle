-- ============================================================
-- SCHEMA V8 — Expanded biofeedback check-ins + habit water tracking
-- ============================================================

-- 1. Drop old 1-5 check constraints on check_ins so we can extend to 0-10
alter table check_ins drop constraint if exists check_ins_training_score_check;
alter table check_ins drop constraint if exists check_ins_nutrition_score_check;
alter table check_ins drop constraint if exists check_ins_mood_score_check;

-- 2. Add new 0-10 constraints
alter table check_ins add constraint check_ins_training_score_check check (training_score between 0 and 10);
alter table check_ins add constraint check_ins_nutrition_score_check check (nutrition_score between 0 and 10);
alter table check_ins add constraint check_ins_mood_score_check check (mood_score between 0 and 10);

-- 3. Add new biofeedback columns
alter table check_ins add column if not exists step_score integer check (step_score between 0 and 10);
alter table check_ins add column if not exists supplementation_score integer check (supplementation_score between 0 and 10);
alter table check_ins add column if not exists sleep_score integer check (sleep_score between 0 and 10);
alter table check_ins add column if not exists digestion_score integer check (digestion_score between 0 and 10);
alter table check_ins add column if not exists strength_score integer check (strength_score between 0 and 10);
alter table check_ins add column if not exists confidence_score integer check (confidence_score between 0 and 10);
alter table check_ins add column if not exists physical_stress_score integer check (physical_stress_score between 0 and 10);
alter table check_ins add column if not exists emotional_stress_score integer check (emotional_stress_score between 0 and 10);
alter table check_ins add column if not exists recovery_score integer check (recovery_score between 0 and 10);
alter table check_ins add column if not exists biofeedback_score numeric;
alter table check_ins add column if not exists urgency text check (urgency in ('all_good', 'few_questions', 'need_help'));
alter table check_ins add column if not exists checkin_type text check (checkin_type in ('express', 'comprehensive'));
alter table check_ins add column if not exists lowest_areas_note text;

-- 4. Add water tracking to habit_logs
alter table habit_logs add column if not exists water_glasses integer check (water_glasses between 0 and 20);
