import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzleSQLite } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import ws from "ws";
import * as schema from "@shared/schema";
import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

neonConfig.webSocketConstructor = ws;

// SQLite für lokale Entwicklung verwenden, wenn keine DATABASE_URL gesetzt ist
let db;
let pool = null;

if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith('sqlite:')) {
  console.log("Verwende SQLite für lokale Entwicklung");
  
  // SQLite-Datei-Pfad
  const dbPath = process.env.DATABASE_URL?.replace('sqlite:', '') || './local_dev.db';
  
  // Stelle sicher, dass das Verzeichnis existiert
  const dir = dirname(dbPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  
  // Initialisiere SQLite
  const sqlite = new Database(dbPath);
  db = drizzleSQLite(sqlite, { schema });
} else {
  // Verwende PostgreSQL in Produktion
  console.log("Verwende PostgreSQL-Verbindung");
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
}

export { db, pool };
