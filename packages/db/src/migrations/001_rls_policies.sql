-- ─────────────────────────────────────────────────────────────────────────────
-- Row-Level Security Policies — ParkSafe v1.0
-- Run in Supabase SQL editor after enabling RLS on each table.
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable RLS on all tables
ALTER TABLE users          ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags           ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_attempts   ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings  ENABLE ROW LEVEL SECURITY;

-- ── Users ─────────────────────────────────────────────────────────────────────
-- Each user can only read and modify their own row
CREATE POLICY "users_own_data" ON users
  FOR ALL
  USING (auth.uid() = id);

-- ── Vehicles ──────────────────────────────────────────────────────────────────
-- Owners can only manage their own vehicles
CREATE POLICY "owner_vehicles_all" ON vehicles
  FOR ALL
  USING (auth.uid() = owner_id);

-- ── Tags ──────────────────────────────────────────────────────────────────────
-- Owners can manage their own tags
CREATE POLICY "tag_owner_manage" ON tags
  FOR ALL
  USING (auth.uid() = owner_id);

-- Public can read ACTIVE tags (masked response enforced in API — not here)
CREATE POLICY "tag_public_read_active" ON tags
  FOR SELECT
  USING (status = 'ACTIVE');

-- ── Contact Events ────────────────────────────────────────────────────────────
-- Owners can see contact events for their tags
CREATE POLICY "contact_events_owner_read" ON contact_events
  FOR SELECT
  USING (
    tag_id IN (SELECT id FROM tags WHERE owner_id = auth.uid())
  );

-- Service role (API) can insert contact events (handled via service role key)
-- No direct client inserts — enforced by not creating an INSERT policy

-- ── User Settings ─────────────────────────────────────────────────────────────
CREATE POLICY "user_settings_own_data" ON user_settings
  FOR ALL
  USING (auth.uid() = user_id);

-- ── OTP Attempts ──────────────────────────────────────────────────────────────
-- OTP attempts are service-role only — no client access
-- No policies created — service role bypasses RLS
