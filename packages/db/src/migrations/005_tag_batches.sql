-- Admin QR tag batch generation
CREATE TYPE tag_batch_status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

CREATE TABLE tag_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requested_count integer NOT NULL CHECK (requested_count > 0),
  completed_count integer NOT NULL DEFAULT 0 CHECK (completed_count >= 0),
  status tag_batch_status NOT NULL DEFAULT 'PENDING',
  error_message text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX tag_batches_status_idx ON tag_batches (status);
CREATE INDEX tag_batches_created_at_idx ON tag_batches (created_at DESC);

ALTER TABLE tags ADD COLUMN batch_id uuid REFERENCES tag_batches (id) ON DELETE SET NULL;
CREATE INDEX tags_batch_idx ON tags (batch_id);
