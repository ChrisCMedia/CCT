import { db, pool } from './db';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { migrate as pgMigrate } from 'drizzle-orm/neon-serverless/migrator';
import { users, todos, subtasks, posts, newsletters, socialAccounts, postAccounts, postAnalytics, postComments, backups } from '@shared/schema';
import { sql } from 'drizzle-orm';

/**
 * Diese Funktion initialisiert die Datenbank und führt notwendige Migrationen durch.
 * Sie wird beim Serverstart ausgeführt.
 */
export async function initializeDatabase() {
  console.log("Initialisiere Datenbank...");
  
  try {
    if (pool) {
      // PostgreSQL in Produktion
      console.log("Führe PostgreSQL-Tabellen-Prüfung durch...");
      
      // Prüfe, ob die users-Tabelle existiert
      const checkTableExists = await db.execute(sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'users'
        );
      `);
      
      const tableExists = checkTableExists[0]?.exists;
      
      if (!tableExists) {
        console.log("Erstelle Tabellen...");
        
        // Erstelle die Tabellen manuell in der richtigen Reihenfolge
        await db.execute(sql`
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
          );
          
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
          
          CREATE TABLE IF NOT EXISTS todos (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            completed BOOLEAN NOT NULL DEFAULT false,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            assigned_to_user_id INTEGER REFERENCES users(id),
            deadline TIMESTAMP
          );
          
          CREATE TABLE IF NOT EXISTS subtasks (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            completed BOOLEAN NOT NULL DEFAULT false,
            todo_id INTEGER NOT NULL REFERENCES todos(id) ON DELETE CASCADE
          );
          
          CREATE TABLE IF NOT EXISTS posts (
            id SERIAL PRIMARY KEY,
            content TEXT NOT NULL,
            image_url TEXT,
            scheduled_date TIMESTAMP NOT NULL,
            approved BOOLEAN NOT NULL DEFAULT false,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
            account_id INTEGER NOT NULL REFERENCES social_accounts(id) ON DELETE RESTRICT,
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
          
          CREATE TABLE IF NOT EXISTS post_accounts (
            id SERIAL PRIMARY KEY,
            post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
            account_id INTEGER NOT NULL REFERENCES social_accounts(id) ON DELETE CASCADE
          );
          
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
          
          CREATE TABLE IF NOT EXISTS post_comments (
            id SERIAL PRIMARY KEY,
            content TEXT NOT NULL,
            post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
          );
          
          CREATE TABLE IF NOT EXISTS newsletters (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
          );
          
          CREATE TABLE IF NOT EXISTS backups (
            id SERIAL PRIMARY KEY,
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            file_name TEXT NOT NULL,
            file_size INTEGER NOT NULL,
            status TEXT NOT NULL DEFAULT 'pending',
            completed_at TIMESTAMP,
            error TEXT
          );
          
          CREATE TABLE IF NOT EXISTS user_sessions (
            sid TEXT PRIMARY KEY,
            sess JSON NOT NULL,
            expire TIMESTAMP(6) NOT NULL
          );
          
          CREATE INDEX IF NOT EXISTS idx_user_sessions_expire ON user_sessions (expire);
        `);
        
        console.log("Datenbanktabellen erfolgreich erstellt");
      } else {
        console.log("Datenbanktabellen existieren bereits");
      }
    } else {
      // SQLite für lokale Entwicklung
      console.log("Führe SQLite-Migration durch...");
      // Keine echte Migration notwendig, da wir SQLite nur für Entwicklung nutzen
      // Drizzle erstellt die Tabellen automatisch
    }
    
    console.log("Datenbankinitialisierung abgeschlossen");
    return true;
  } catch (error) {
    console.error("Fehler bei der Datenbankinitialisierung:", error);
    throw error;
  }
} 