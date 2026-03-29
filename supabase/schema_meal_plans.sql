-- Meal Plans table
-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS meal_plans (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id    uuid REFERENCES profiles(id) ON DELETE SET NULL,
  client_id   uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name        text NOT NULL DEFAULT 'My Meal Plan',
  is_active   boolean DEFAULT true,
  days        jsonb DEFAULT '{}'::jsonb,
  notes       text,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coaches manage meal plans"
  ON meal_plans FOR ALL
  USING (auth.uid() = coach_id);

CREATE POLICY "Clients view own meal plans"
  ON meal_plans FOR SELECT
  USING (auth.uid() = client_id);

CREATE INDEX IF NOT EXISTS idx_meal_plans_client ON meal_plans(client_id);
CREATE INDEX IF NOT EXISTS idx_meal_plans_coach  ON meal_plans(coach_id);
