-- ============================================================
-- SCHEMA V10 — Add superset_group to exercises for template support
-- ============================================================
alter table exercises add column if not exists superset_group text;
