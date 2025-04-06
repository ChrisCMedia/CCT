import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzleSQLite } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import ws from "ws";
import * as schema from "@shared/schema";
import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

// DEBUG: Log der Umgebungsvariablen (teilweise maskiert)
console.log("--- DB VERBINDUNGS-DEBUG START ---");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("VERCEL:", process.env.VERCEL);
console.log("DATABASE_URL vorhanden:", !!process.env.DATABASE_URL);
console.log("DIRECT_URL vorhanden:", !!process.env.DIRECT_URL);

if (process.env.DATABASE_URL) {
  // Maskiere sensible Daten, zeige aber das Format
  const urlParts = process.env.DATABASE_URL.split('@');
  if (urlParts.length > 1) {
    const hostPart = urlParts[1];
    console.log("DATABASE_URL Format: postgresql://[username]:[password]@" + hostPart);
  }
}

if (process.env.DIRECT_URL) {
  // Maskiere sensible Daten, zeige aber das Format
  const urlParts = process.env.DIRECT_URL.split('@');
  if (urlParts.length > 1) {
    const hostPart = urlParts[1];
    console.log("DIRECT_URL Format: postgresql://[username]:[password]@" + hostPart);
  }
}

// WebSocket für Neon konfigurieren
console.log("Konfiguriere neonConfig...");
neonConfig.webSocketConstructor = ws;
// Proxy für WebSockets aktivieren (nur für Vercel)
const wsProxy = process.env.VERCEL === 'true' || process.env.VERCEL === '1' ? true : undefined;
console.log("WebSocket Proxy aktiviert:", wsProxy);
neonConfig.wsProxy = wsProxy;

// Custom Konfiguration für bessere Verbindungsstabilität
console.log("Setze erweiterte Verbindungskonfiguration...");
// Diese sind nicht Teil der öffentlichen API von Neon, daher TypeScript-Fehler ignorieren
(neonConfig as any).connectTimeout = 30 * 1000;
(neonConfig as any).retryInterval = 1000;
(neonConfig as any).retryLimit = 5;
console.log("Verbindungs-Timeout:", (neonConfig as any).connectTimeout, "ms");

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
    
    // Maskierte URL-Anzeige
    const urlParts = connectionString?.split('@');
    if (urlParts && urlParts.length > 1) {
      const hostPart = urlParts[1];
      console.log("Verwendete Verbindungs-URL: postgresql://[username]:[password]@" + hostPart);
    }
    
    // Füge einen Timeout für die Verbindung hinzu
    console.log("Erstelle DB-Pool mit folgenden Optionen:");
    console.log("- connectionTimeoutMillis: 30000");
    console.log("- max Connections:", process.env.VERCEL ? 1 : 10);
    console.log("- idleTimeoutMillis: 15000");
    
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
      
      console.log("Führe Test-Query aus...");
      const testResult = await Promise.race([
        pool.query('SELECT 1 as test'),
        timeoutPromise
      ]);
      
      console.log("PostgreSQL-Verbindung erfolgreich getestet:", JSON.stringify(testResult));
    } catch (connError: any) {
      console.error("PostgreSQL-Verbindungstest fehlgeschlagen:");
      console.error("Fehlertyp:", typeof connError);
      console.error("Fehlermeldung:", connError.message);
      console.error("Stack:", connError.stack);
      
      if (connError.code) {
        console.error("Fehlercode:", connError.code);
      }
      
      // Versuche trotzdem die DB zu initialisieren
    }
    
    console.log("Initialisiere Drizzle ORM mit Pool...");
    db = drizzle({ client: pool, schema });
    console.log("PostgreSQL-Verbindung vollständig initialisiert");
  } else {
    console.log("Verwende SQLite für lokale Entwicklung");
    
    // SQLite-Datei-Pfad
    const dbPath = process.env.DATABASE_URL?.replace('sqlite:', '') || './local_dev.db';
    console.log("SQLite Pfad:", dbPath);
    
    // Stelle sicher, dass das Verzeichnis existiert
    const dir = dirname(dbPath);
    if (!existsSync(dir)) {
      console.log("Erstelle Verzeichnis:", dir);
      mkdirSync(dir, { recursive: true });
    }
    
    // Initialisiere SQLite
    console.log("Initialisiere SQLite...");
    const sqlite = new Database(dbPath);
    db = drizzleSQLite(sqlite, { schema });
    console.log("SQLite-Verbindung initialisiert:", dbPath);
  }
} catch (error: any) {
  console.error("KRITISCHER FEHLER bei der Datenbankinitialisierung:");
  console.error("Fehlertyp:", typeof error);
  console.error("Fehlermeldung:", error.message);
  console.error("Stack-Trace:", error.stack);
  
  if (error.code) {
    console.error("Fehlercode:", error.code);
  }
  
  // Sicherheits-Fallback zu SQLite, wenn PostgreSQL-Verbindung fehlschlägt
  if (!db) {
    console.log("Verwende SQLite als NOTFALL-Fallback");
    const sqlite = new Database('./emergency_fallback.db');
    db = drizzleSQLite(sqlite, { schema });
  }
}

console.log("--- DB VERBINDUNGS-DEBUG ENDE ---");

export { db, pool };
