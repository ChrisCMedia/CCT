import Database from 'better-sqlite3';

// Erstelle Datenbankverbindung
const db = new Database('./local_dev.db');

// Aktiviere Foreign Keys
db.pragma('foreign_keys = ON');

console.log('Initialisiere SQLite-Datenbank für lokale Entwicklung...');

// Benutzer-Tabelle
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);
`);

// Social Media Accounts
db.exec(`
CREATE TABLE IF NOT EXISTS social_accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  platform TEXT NOT NULL,
  account_name TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP,
  platform_user_id TEXT,
  platform_page_id TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`);

// Todos
db.exec(`
CREATE TABLE IF NOT EXISTS todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN NOT NULL DEFAULT 0,
  user_id INTEGER NOT NULL,
  assigned_to_user_id INTEGER,
  deadline TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to_user_id) REFERENCES users(id)
);
`);

// Subtasks
db.exec(`
CREATE TABLE IF NOT EXISTS subtasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT 0,
  todo_id INTEGER NOT NULL,
  FOREIGN KEY (todo_id) REFERENCES todos(id) ON DELETE CASCADE
);
`);

// Posts
db.exec(`
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL,
  image_url TEXT,
  scheduled_date TIMESTAMP NOT NULL,
  approved BOOLEAN NOT NULL DEFAULT 0,
  user_id INTEGER NOT NULL,
  account_id INTEGER NOT NULL,
  last_edited_at TIMESTAMP,
  last_edited_by_user_id INTEGER,
  platform_post_id TEXT,
  visibility TEXT DEFAULT 'public',
  article_url TEXT,
  post_type TEXT DEFAULT 'post',
  publish_status TEXT DEFAULT 'draft',
  failure_reason TEXT,
  deleted_at TIMESTAMP,
  scheduled_in_linkedin BOOLEAN DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
  FOREIGN KEY (account_id) REFERENCES social_accounts(id) ON DELETE RESTRICT,
  FOREIGN KEY (last_edited_by_user_id) REFERENCES users(id)
);
`);

// Post Accounts
db.exec(`
CREATE TABLE IF NOT EXISTS post_accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  account_id INTEGER NOT NULL,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES social_accounts(id) ON DELETE CASCADE
);
`);

// Post Analytics
db.exec(`
CREATE TABLE IF NOT EXISTS post_analytics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  engagement_rate INTEGER DEFAULT 0,
  demographic_data TEXT,
  updated_at TIMESTAMP NOT NULL,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);
`);

// Post Kommentare
db.exec(`
CREATE TABLE IF NOT EXISTS post_comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL,
  post_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`);

// Newsletter
db.exec(`
CREATE TABLE IF NOT EXISTS newsletters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`);

// Backups
db.exec(`
CREATE TABLE IF NOT EXISTS backups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  completed_at TIMESTAMP,
  error TEXT
);
`);

// Erstelle einen Testbenutzer
const insertUser = db.prepare('INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)');
insertUser.run('admin', 'admin123');

console.log('Datenbank wurde erfolgreich initialisiert.');

// Demo Social Account
const insertSocialAccount = db.prepare('INSERT OR IGNORE INTO social_accounts (platform, account_name, user_id) VALUES (?, ?, ?)');
insertSocialAccount.run('linkedin', 'Demo LinkedIn Account', 1);

console.log('Testdaten wurden eingefügt.');

// Schließe die Datenbankverbindung
db.close();
