-- Narqix Academy schema (Cloudflare D1 / SQLite). Times are Unix epoch milliseconds.

CREATE TABLE candidates (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,          -- normalized +8801XXXXXXXXX
  email TEXT NOT NULL UNIQUE,          -- lowercased
  district TEXT NOT NULL,
  track TEXT NOT NULL,
  cv_url TEXT,
  password_hash TEXT,                  -- null when the candidate only uses email codes
  email_verified INTEGER NOT NULL DEFAULT 0,
  hiring_status TEXT NOT NULL DEFAULT 'new',   -- new | contacted | interview | hired
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX idx_candidates_track ON candidates(track);
CREATE INDEX idx_candidates_status ON candidates(hiring_status);

CREATE TABLE sessions (
  token_hash TEXT PRIMARY KEY,
  candidate_id TEXT NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX idx_sessions_candidate ON sessions(candidate_id);

CREATE TABLE login_codes (
  email TEXT PRIMARY KEY,
  code_hash TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);

CREATE TABLE rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  reset_at INTEGER NOT NULL
);

CREATE TABLE lesson_progress (
  candidate_id TEXT NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  read_at INTEGER NOT NULL,
  PRIMARY KEY (candidate_id, lesson_id)
);

CREATE TABLE exam_attempts (
  id TEXT PRIMARY KEY,
  candidate_id TEXT NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  exam_id TEXT NOT NULL,
  role TEXT,
  status TEXT NOT NULL,                -- in_progress | passed | failed
  started_at INTEGER NOT NULL,
  deadline_at INTEGER NOT NULL,
  submitted_at INTEGER,
  layout_json TEXT NOT NULL,           -- shuffled question order + option permutations (server only)
  answers_json TEXT NOT NULL DEFAULT '{}',
  score INTEGER,
  total INTEGER NOT NULL,
  gates_missed INTEGER,
  result_json TEXT
);
CREATE INDEX idx_attempts_candidate_exam ON exam_attempts(candidate_id, exam_id, started_at);

CREATE TABLE certificates (
  id TEXT PRIMARY KEY,                 -- public ID, e.g. NQX-7K3M-Q9TD
  candidate_id TEXT NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  track TEXT NOT NULL,
  foundation_attempt_id TEXT NOT NULL,
  track_attempt_id TEXT NOT NULL,
  foundation_score TEXT NOT NULL,      -- "35/40"
  track_score TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'valid', -- valid | revoked
  issued_at INTEGER NOT NULL,
  UNIQUE (candidate_id, track)
);

CREATE TABLE status_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  candidate_id TEXT NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  changed_by TEXT NOT NULL,
  changed_at INTEGER NOT NULL
);
