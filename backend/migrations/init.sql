CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id          UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  username    VARCHAR(50)  UNIQUE NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,
  avatar_url  VARCHAR(500),
  created_at  TIMESTAMPTZ  DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rooms (
  id           SERIAL       PRIMARY KEY,
  slug         VARCHAR(50)  UNIQUE NOT NULL,
  name         VARCHAR(100) NOT NULL,
  description  TEXT,
  order_index  INTEGER      NOT NULL,
  theme_color  VARCHAR(7),
  icon         VARCHAR(50),
  created_at   TIMESTAMPTZ  DEFAULT NOW()
);

INSERT INTO rooms (slug, name, description, order_index, theme_color, icon) VALUES
  ('technosys',   'Technosys',     'Hackathons & E-Sports arena',        1, '#00FFFF', '💻'),
  ('velocity',    'Velocity',      'Project development lab',            2, '#FF6B00', '🚀'),
  ('return0',     'Return 0',      'Competitive coding dungeon',         3, '#00FF41', '</>'),
  ('iris',        'IRIS',          'Robotics & automation workshop',     4, '#FF0080', '🤖'),
  ('inquizitive', 'InQuizitive',   'Knowledge & trivia vault',           5, '#FFD700', '🧠'),
  ('ecell',       'E-Cell',        'Entrepreneurship strategy room',     6, '#9B59B6', '💡'),
  ('hertz440',    '440 Hertz',     'Music theory & rhythm studio',       7, '#FF69B4', '🎵'),
  ('dynamight',   'Dynamight',     'Dance pattern & rhythm floor',       8, '#FF4500', '💃'),
  ('final',       'Final Chamber', 'The ultimate combined challenge',    9, '#FFFFFF', '🏆')
ON CONFLICT (slug) DO NOTHING;

CREATE TABLE IF NOT EXISTS game_sessions (
  id               UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  started_at       TIMESTAMPTZ DEFAULT NOW(),
  completed_at     TIMESTAMPTZ,
  total_time_secs  INTEGER,
  is_active        BOOLEAN DEFAULT TRUE,
  score            INTEGER DEFAULT 0,
  is_escaped       BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS room_progress (
  id               UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id       UUID    NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  user_id          UUID    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  room_id          INTEGER NOT NULL REFERENCES rooms(id),
  is_unlocked      BOOLEAN DEFAULT FALSE,
  is_completed     BOOLEAN DEFAULT FALSE,
  key_collected    BOOLEAN DEFAULT FALSE,
  puzzle_states    JSONB   DEFAULT '{}',
  attempts         INTEGER DEFAULT 0,
  time_spent_secs  INTEGER DEFAULT 0,
  completed_at     TIMESTAMPTZ,
  UNIQUE(session_id, room_id)
);

CREATE TABLE IF NOT EXISTS leaderboard (
  id               UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  username         VARCHAR(50)  NOT NULL,
  score            INTEGER NOT NULL DEFAULT 0,
  total_time_secs  INTEGER NOT NULL,
  rooms_completed  INTEGER NOT NULL DEFAULT 0,
  session_id       UUID    REFERENCES game_sessions(id),
  achieved_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_user     ON game_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_active   ON game_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_progress_session  ON room_progress(session_id);
CREATE INDEX IF NOT EXISTS idx_progress_user     ON room_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_user  ON leaderboard(user_id);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();