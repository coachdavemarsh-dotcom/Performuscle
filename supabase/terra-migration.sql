-- Terra wearable integration tables
-- Run in Supabase SQL Editor after garmin-migration.sql (or after schema.sql)

-- ─── Wearable connections (one row per user × provider) ──────────────────────
CREATE TABLE IF NOT EXISTS terra_connections (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  terra_user_id TEXT NOT NULL,
  provider     TEXT NOT NULL,  -- APPLE | GARMIN | FITBIT | GOOGLE | POLAR | SUUNTO | WHOOP
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

ALTER TABLE terra_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "terra_connections_select" ON terra_connections
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "terra_connections_delete" ON terra_connections
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "terra_connections_service" ON terra_connections
  FOR ALL USING (auth.role() = 'service_role');

-- ─── Daily activity summaries (from Terra webhooks) ──────────────────────────
CREATE TABLE IF NOT EXISTS terra_daily_activity (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date                  DATE NOT NULL,
  steps                 INTEGER DEFAULT 0,
  total_burned_calories INTEGER DEFAULT 0,
  bmr_calories          INTEGER DEFAULT 0,
  activity_calories     INTEGER DEFAULT 0,
  active_seconds        INTEGER DEFAULT 0,
  avg_hr                INTEGER,
  sleep_seconds         INTEGER DEFAULT 0,
  provider              TEXT,
  raw_data              JSONB,
  updated_at            TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date, provider)
);

ALTER TABLE terra_daily_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "terra_daily_activity_select" ON terra_daily_activity
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "terra_daily_activity_service" ON terra_daily_activity
  FOR ALL USING (auth.role() = 'service_role');
