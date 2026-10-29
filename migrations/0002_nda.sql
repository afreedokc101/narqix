-- NDA gate: candidates must upload a signed NDA and be approved by the hiring team
-- before they can open lessons, exams or their dashboard.

-- pending_nda (no NDA yet) | nda_submitted (waiting for review) | approved | rejected (must upload again)
ALTER TABLE candidates ADD COLUMN access_status TEXT NOT NULL DEFAULT 'pending_nda';
ALTER TABLE candidates ADD COLUMN access_note TEXT;            -- reason shown to the candidate when rejected
ALTER TABLE candidates ADD COLUMN access_reviewed_by TEXT;
ALTER TABLE candidates ADD COLUMN access_reviewed_at INTEGER;
CREATE INDEX idx_candidates_access ON candidates(access_status);

-- One row per uploaded NDA. The latest upload is the one under review; older ones are kept for the record.
CREATE TABLE nda_files (
  id TEXT PRIMARY KEY,
  candidate_id TEXT NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  content_type TEXT NOT NULL,          -- application/pdf | image/jpeg | image/png
  size INTEGER NOT NULL,
  uploaded_at INTEGER NOT NULL
);
CREATE INDEX idx_nda_candidate ON nda_files(candidate_id, uploaded_at);

-- File bytes, split into chunks because a D1 value is limited to about 2 MB.
CREATE TABLE nda_chunks (
  file_id TEXT NOT NULL REFERENCES nda_files(id) ON DELETE CASCADE,
  idx INTEGER NOT NULL,
  data BLOB NOT NULL,
  PRIMARY KEY (file_id, idx)
);
