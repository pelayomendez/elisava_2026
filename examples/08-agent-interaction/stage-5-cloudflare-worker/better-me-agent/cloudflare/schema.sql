CREATE TABLE IF NOT EXISTS user_memory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  memory_key TEXT NOT NULL UNIQUE,
  memory_value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS run_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL,
  trigger_mode TEXT NOT NULL,
  message TEXT NOT NULL,
  answer TEXT NOT NULL,
  model TEXT NOT NULL,
  slack_sent INTEGER NOT NULL DEFAULT 0,
  slack_detail TEXT
);

INSERT OR IGNORE INTO user_memory (memory_key, memory_value)
VALUES
  ('goal_sleep', 'User wants to sleep better.'),
  ('habit_water', 'User struggles drinking enough water.'),
  ('recent_win', 'User completed yesterday''s walking challenge.'),
  ('tone', 'User prefers short messages.');
