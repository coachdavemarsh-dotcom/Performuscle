-- ============================================================
-- RECIPES TABLE — Performuscle Recipe Library
-- Run in Supabase SQL Editor
-- ============================================================

-- 1. Create table
CREATE TABLE IF NOT EXISTS recipes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  category    text NOT NULL CHECK (category IN ('breakfast','lunch','dinner','snack')),
  tags        text[]   DEFAULT '{}',
  kcal        int,
  protein_g   numeric,
  carbs_g     numeric,
  fat_g       numeric,
  servings    int DEFAULT 1,
  ingredients jsonb DEFAULT '[]',
  method      text,
  image_url   text,
  source      text,
  is_public   boolean DEFAULT true,
  created_by  uuid REFERENCES auth.users ON DELETE SET NULL,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- 2. RLS
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Clients can read all public recipes
CREATE POLICY "Anyone authenticated can read public recipes"
  ON recipes FOR SELECT
  TO authenticated
  USING (is_public = true);

-- Coaches can do everything
CREATE POLICY "Coaches can manage recipes"
  ON recipes FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_coach = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_coach = true
    )
  );

-- 3. Auto-update updated_at
CREATE OR REPLACE FUNCTION update_recipes_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER recipes_updated_at
  BEFORE UPDATE ON recipes
  FOR EACH ROW EXECUTE FUNCTION update_recipes_updated_at();

-- ============================================================
-- RECIPE LOGS — when a client adds a recipe to their day
-- (extends the existing nutrition_logs table via a recipe_id FK)
-- Run this only if the nutrition_logs table already exists
-- ============================================================
ALTER TABLE nutrition_logs
  ADD COLUMN IF NOT EXISTS recipe_id uuid REFERENCES recipes(id) ON DELETE SET NULL;

-- Index for fast recipe lookups
CREATE INDEX IF NOT EXISTS recipes_category_idx ON recipes(category);
CREATE INDEX IF NOT EXISTS recipes_tags_idx ON recipes USING GIN(tags);
