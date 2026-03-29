-- ============================================================
-- FOODS TABLE — Performuscle Nutrition Database
-- Run this in Supabase SQL Editor BEFORE seed_foods.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS foods (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL UNIQUE,
  serving_amount  numeric NOT NULL DEFAULT 100,
  serving_unit    text NOT NULL DEFAULT 'g',
  kcal            numeric NOT NULL DEFAULT 0,
  protein_g       numeric NOT NULL DEFAULT 0,
  carbs_g         numeric NOT NULL DEFAULT 0,
  fat_g           numeric NOT NULL DEFAULT 0,
  fibre_g         numeric NOT NULL DEFAULT 0,
  net_carbs_g     numeric NOT NULL DEFAULT 0,
  category        text,
  source          text DEFAULT 'coach_db',
  created_at      timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "foods_read"        ON foods;
DROP POLICY IF EXISTS "foods_coach_write" ON foods;

-- Any authenticated user can read
CREATE POLICY "foods_read" ON foods
  FOR SELECT TO authenticated USING (true);

-- Only coaches can insert / update / delete
CREATE POLICY "foods_coach_write" ON foods
  FOR ALL TO authenticated
  USING  (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_coach = true))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_coach = true));

-- Indexes for fast search
CREATE INDEX IF NOT EXISTS foods_name_trgm  ON foods USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS foods_name_lower ON foods (lower(name));
CREATE INDEX IF NOT EXISTS foods_category   ON foods (category);

-- Enable pg_trgm extension if not already on
CREATE EXTENSION IF NOT EXISTS pg_trgm;
