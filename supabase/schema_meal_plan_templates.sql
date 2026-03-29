-- ─── Meal Plan Templates ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS meal_plan_templates (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id    uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name        text NOT NULL,
  description text,
  category    text DEFAULT 'standard'
              CHECK (category IN ('cut','bulk','maintenance','psmf','standard')),
  days        jsonb DEFAULT '{}',
  is_system   boolean DEFAULT false,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

ALTER TABLE meal_plan_templates ENABLE ROW LEVEL SECURITY;

-- Coaches manage their own templates
CREATE POLICY "coaches_manage_own_templates"
  ON meal_plan_templates FOR ALL
  USING  (coach_id = auth.uid())
  WITH CHECK (coach_id = auth.uid());

-- Coaches can read system templates (coach_id IS NULL)
CREATE POLICY "coaches_read_system_templates"
  ON meal_plan_templates FOR SELECT
  USING (is_system = true);
