-- Garmin Connect integration tables
-- Run in Supabase SQL Editor after the main schema.sql

-- ─── Garmin OAuth connections ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS garmin_connections (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  access_token        TEXT NOT NULL,
  access_token_secret TEXT NOT NULL,
  garmin_user_id      TEXT,
  connected_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE garmin_connections ENABLE ROW LEVEL SECURITY;

-- Users can only see/delete their own connection
CREATE POLICY "garmin_connections_select" ON garmin_connections
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "garmin_connections_delete" ON garmin_connections
  FOR DELETE USING (auth.uid() = user_id);

-- Only the service role (Railway server) can insert/update
CREATE POLICY "garmin_connections_service_upsert" ON garmin_connections
  FOR ALL USING (auth.role() = 'service_role');

-- ─── Pushed workouts (session → Garmin workout ID mapping) ───────────────────
CREATE TABLE IF NOT EXISTS garmin_pushed_workouts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id        UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  garmin_workout_id TEXT NOT NULL,
  scheduled_date    DATE,
  pushed_at         TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, user_id)
);

ALTER TABLE garmin_pushed_workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "garmin_pushed_workouts_select" ON garmin_pushed_workouts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "garmin_pushed_workouts_service" ON garmin_pushed_workouts
  FOR ALL USING (auth.role() = 'service_role');

-- ─── Incoming Garmin activities (from webhook) ────────────────────────────────
CREATE TABLE IF NOT EXISTS garmin_activities (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  garmin_activity_id TEXT UNIQUE,
  activity_type      TEXT,
  start_time         TIMESTAMP WITH TIME ZONE,
  duration_seconds   INTEGER,
  distance_meters    NUMERIC,
  avg_hr             INTEGER,
  max_hr             INTEGER,
  calories           INTEGER,
  avg_speed_ms       NUMERIC,
  matched_session_id UUID REFERENCES sessions(id),
  raw_data           JSONB,
  created_at         TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE garmin_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "garmin_activities_select" ON garmin_activities
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "garmin_activities_service" ON garmin_activities
  FOR ALL USING (auth.role() = 'service_role');
