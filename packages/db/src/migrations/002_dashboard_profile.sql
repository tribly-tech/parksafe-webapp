-- ─────────────────────────────────────────────────────────────────────────────
-- Dashboard & profile — incremental migration (existing databases)
-- Adds reporter_user_id to contact_events and user_settings table.
-- Safe to run multiple times (IF NOT EXISTS / duplicate_object guards).
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE contact_events
  ADD COLUMN IF NOT EXISTS reporter_user_id uuid;

DO $$ BEGIN
  ALTER TABLE contact_events
    ADD CONSTRAINT contact_events_reporter_user_id_users_id_fk
    FOREIGN KEY (reporter_user_id) REFERENCES users(id) ON DELETE SET NULL;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE INDEX IF NOT EXISTS contact_events_reporter_user_idx
  ON contact_events (reporter_user_id);

CREATE TABLE IF NOT EXISTS user_settings (
  user_id uuid PRIMARY KEY NOT NULL,
  notify_sms boolean DEFAULT true NOT NULL,
  notify_whatsapp boolean DEFAULT true NOT NULL,
  marketing_emails boolean DEFAULT false NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);

DO $$ BEGIN
  ALTER TABLE user_settings
    ADD CONSTRAINT user_settings_user_id_users_id_fk
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- RLS for user_settings (service role bypasses; owners manage own row)
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY user_settings_own_data ON user_settings
    FOR ALL
    USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
