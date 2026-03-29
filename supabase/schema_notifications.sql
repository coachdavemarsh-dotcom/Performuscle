-- ============================================================
-- NOTIFICATIONS + PROGRESS PHOTOS
-- Run in Supabase SQL Editor
-- ============================================================

-- 1. Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id   uuid REFERENCES auth.users ON DELETE CASCADE,
  client_id  uuid REFERENCES auth.users ON DELETE CASCADE,
  type       text NOT NULL,   -- 'workout_note' | 'check_in' | 'progress_photo' | 'measurement'
  title      text NOT NULL,
  body       text,
  data       jsonb DEFAULT '{}',
  is_read    boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Coaches can read their own notifications
CREATE POLICY "Coaches read own notifications"
  ON notifications FOR SELECT TO authenticated
  USING (coach_id = auth.uid());

-- Coaches can update (mark as read)
CREATE POLICY "Coaches update own notifications"
  ON notifications FOR UPDATE TO authenticated
  USING (coach_id = auth.uid());

-- Any authenticated user can insert (clients notify their coach)
CREATE POLICY "Authenticated users can insert notifications"
  ON notifications FOR INSERT TO authenticated
  WITH CHECK (true);

-- Index for fast unread lookups
CREATE INDEX IF NOT EXISTS notifications_coach_unread_idx
  ON notifications (coach_id, is_read, created_at DESC);

-- 2. Add photos column to measurements (for progress photos)
ALTER TABLE measurements
  ADD COLUMN IF NOT EXISTS photos jsonb DEFAULT '{}';
