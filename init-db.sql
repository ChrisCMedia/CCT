-- Tabellendefinitionen für Neon-Datenbank

-- Users Tabelle
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

-- Session Tabelle
CREATE TABLE IF NOT EXISTS user_sessions (
  sid TEXT PRIMARY KEY,
  sess JSON NOT NULL,
  expire TIMESTAMP(6) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expire ON user_sessions (expire);

-- Social Accounts Tabelle
CREATE TABLE IF NOT EXISTS social_accounts (
  id SERIAL PRIMARY KEY,
  platform TEXT NOT NULL,
  account_name TEXT NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP,
  platform_user_id TEXT,
  platform_page_id TEXT
);

-- Todos Tabelle
CREATE TABLE IF NOT EXISTS todos (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_to_user_id INTEGER REFERENCES users(id),
  deadline TIMESTAMP
);

-- Subtasks Tabelle
CREATE TABLE IF NOT EXISTS subtasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  todo_id INTEGER NOT NULL REFERENCES todos(id) ON DELETE CASCADE
);

-- Posts Tabelle
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  image_url TEXT,
  scheduled_date TIMESTAMP NOT NULL,
  approved BOOLEAN NOT NULL DEFAULT false,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  account_id INTEGER REFERENCES social_accounts(id) ON DELETE RESTRICT,
  last_edited_at TIMESTAMP,
  last_edited_by_user_id INTEGER REFERENCES users(id),
  platform_post_id TEXT,
  visibility TEXT DEFAULT 'public',
  article_url TEXT,
  post_type TEXT DEFAULT 'post',
  publish_status TEXT DEFAULT 'draft',
  failure_reason TEXT,
  deleted_at TIMESTAMP,
  scheduled_in_linkedin BOOLEAN DEFAULT false
);

-- Post Accounts Tabelle
CREATE TABLE IF NOT EXISTS post_accounts (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  account_id INTEGER NOT NULL REFERENCES social_accounts(id) ON DELETE CASCADE
);

-- Post Analytics Tabelle
CREATE TABLE IF NOT EXISTS post_analytics (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  engagement_rate INTEGER DEFAULT 0,
  demographic_data JSONB,
  updated_at TIMESTAMP NOT NULL
);

-- Post Comments Tabelle
CREATE TABLE IF NOT EXISTS post_comments (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Newsletters Tabelle
CREATE TABLE IF NOT EXISTS newsletters (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- Backups Tabelle
CREATE TABLE IF NOT EXISTS backups (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  completed_at TIMESTAMP,
  error TEXT
);

-- Admin-Benutzer erstellen
INSERT INTO users (username, password) 
VALUES ('admin', 'admin123')
ON CONFLICT (username) DO NOTHING; 