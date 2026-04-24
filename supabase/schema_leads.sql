-- ─── Leads table ──────────────────────────────────────────────────────────────
-- Captures email + name from the public meal planner (and any future lead sources).
-- Upserts on email so repeat users update rather than duplicate.

CREATE TABLE IF NOT EXISTS leads (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  email       text        NOT NULL UNIQUE,
  name        text,
  source      text        NOT NULL DEFAULT 'meal-planner',
  tags        text[]      DEFAULT '{}',
  meta        jsonb       DEFAULT '{}'::jsonb,
  converted   boolean     NOT NULL DEFAULT false,   -- flip to true when they become a client
  notes       text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Auto-update updated_at on every row change
CREATE OR REPLACE FUNCTION touch_leads_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS leads_updated_at ON leads;
CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION touch_leads_updated_at();

-- RLS: coaches (service role) can read all leads; public cannot
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access"
  ON leads FOR ALL
  USING (true)
  WITH CHECK (true);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS leads_source_idx     ON leads (source);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_converted_idx  ON leads (converted);
