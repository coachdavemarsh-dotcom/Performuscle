-- ============================================================
-- SCHEMA V6 — Conditioning session types
-- Run in Supabase SQL Editor
-- ============================================================

alter table sessions
  add column if not exists session_type        text    default 'strength',
  add column if not exists conditioning_config jsonb;

-- Back-fill existing sessions as strength
update sessions set session_type = 'strength' where session_type is null;
