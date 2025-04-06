import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzleSQLite } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import ws from "ws";
import * as schema from "@shared/schema";
import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

// WebSocket für Neon konfigurieren
neonConfig.webSocketConstructor = ws;
// Debugging für Neon-Verbindungen aktivieren
neonConfig.wsProxy = process.env.VERCEL ? true : false;
// 30 Sekunden Timeout für Neon-Verbindungen
neonConfig.connectTimeout = 30 * 1000;
// Versuche 5 mal zu verbinden
neonConfig.retryInterval = 1000;
neonConfig.retryLimit = 5;

// SQLite für lokale Entwicklung verwenden, wenn keine DATABASE_URL gesetzt ist
let db;
let pool = null;

// Stelle sicher, dass die DATABASE_URL Umgebungsvariable existiert
if (!process.env.DATABASE_URL) {
  console.error("WARNUNG: DATABASE_URL ist nicht gesetzt! Verwende SQLite als Fallback.");
}

try {
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('sqlite:')) {
    console.log("Verbinde mit PostgreSQL-Datenbank...");
    
    // Verwende direkte URL für Vercel oder pooler für andere Umgebungen
    const connectionString = process.env.VERCEL && process.env.DIRECT_URL ? 
      process.env.DIRECT_URL : process.env.DATABASE_URL;
    
    console.log(`Verbindungstyp: ${process.env.VERCEL ? 'Direkte Verbindung (DIRECT_URL)' : 'Pooler (DATABASE_URL)'}`);
    console.log("Verwendete Datenbankverbindungs-URL:", connectionString?.substring(0, 25) + '...');
    
    // Füge einen Timeout für die Verbindung hinzu
    pool = new Pool({ 
      connectionString,
      connectionTimeoutMillis: 30000, // 30 Sekunden Timeout
      max: process.env.VERCEL ? 1 : 10, // Weniger Verbindungen auf Vercel
      idleTimeoutMillis: 15000, // 15 Sekunden Timeout für idle Verbindungen
    });
    
    // Teste sofort die Verbindung mit Timeout
    try {
      console.log("Teste Datenbankverbindung...");
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Datenbankverbindungs-Timeout')), 10000);
      });
      
      const testResult = await Promise.race([
        pool.query('SELECT 1 as test'),
        timeoutPromise
      ]);
      
      console.log("PostgreSQL-Verbindung erfolgreich getestet:", testResult);
    } catch (connError) {
      console.error("PostgreSQL-Verbindungstest fehlgeschlagen:", connError);
      // Versuche trotzdem die DB zu initialisieren
    }
    
    db = drizzle({ client: pool, schema });
    console.log("PostgreSQL-Verbindung initialisiert");
  } else {
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
    console.log("SQLite-Verbindung initialisiert:", dbPath);
  }
} catch (error) {
  console.error("KRITISCHER FEHLER bei der Datenbankinitialisierung:", error);
  console.error("Stack-Trace:", error.stack);
  
  // Sicherheits-Fallback zu SQLite, wenn PostgreSQL-Verbindung fehlschlägt
  if (!db) {
    console.log("Verwende SQLite als NOTFALL-Fallback");
    const sqlite = new Database('./emergency_fallback.db');
    db = drizzleSQLite(sqlite, { schema });
  }
}

export { db, pool };
