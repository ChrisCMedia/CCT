import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzleSQLite } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import ws from "ws";
import * as schema from "../shared/schema.js";
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

// Exportierte Funktionen für direkten Zugriff ohne Pool
export async function executeDirectQuery(query: string, params?: any[]): Promise<any> {
  try {
    if (pool) {
      console.log("Führe direkte Query aus:", query.substring(0, 80) + "...", "Params:", params);
      const result = await pool.query(query, params);
      console.log("Query erfolgreich ausgeführt, Zeilen:", result.rowCount);
      return result;
    } else {
      console.error("FEHLER: Kein DB-Pool verfügbar");
      throw new Error("Kein DB-Pool verfügbar");
    }
  } catch (error: any) {
    console.error("FEHLER bei direkter Query:", error.message);
    console.error("Stack:", error.stack);
    throw error;
  }
}

// SQL für direktes Testen
export async function testDB(): Promise<boolean> {
  try {
    if (pool) {
      const result = await executeDirectQuery("SELECT 1 as test");
      console.log("Datenbank Test erfolgreich:", result.rows[0]);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Datenbank Test fehlgeschlagen:", error);
    return false;
  }
}

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
      
      // Erstelle Admin-Benutzer wenn noch nicht vorhanden
      try {
        console.log("Prüfe, ob Admin-Benutzer existiert...");
        const adminCheck = await pool.query('SELECT * FROM users WHERE username = $1 LIMIT 1', ['admin']);
        
        if (adminCheck.rows.length === 0) {
          console.log("Admin-Benutzer nicht gefunden, erstelle einen...");
          
          // Importiere hash-Funktion aus auth.ts
          const { hashPassword } = await import('./auth');
          const hashedPassword = await hashPassword('admin123');
          
          await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            ['admin', hashedPassword]
          );
          
          console.log("Admin-Benutzer erfolgreich erstellt");
        } else {
          console.log("Admin-Benutzer existiert bereits");
          
          // Überprüfe, ob das Passwort gehashed ist
          const user = adminCheck.rows[0];
          if (!user.password.includes('.')) {
            console.log("Admin-Passwort ist nicht gehashed, aktualisiere...");
            
            const { hashPassword } = await import('./auth');
            const hashedPassword = await hashPassword('admin123');
            
            await pool.query(
              'UPDATE users SET password = $1 WHERE username = $2',
              [hashedPassword, 'admin']
            );
            
            console.log("Admin-Passwort erfolgreich aktualisiert");
          }
        }
      } catch (adminError: any) {
        console.error("Fehler beim Prüfen oder Erstellen des Admin-Benutzers:", adminError.message);
      }
    } catch (connError: any) {
      console.error("PostgreSQL-Verbindungstest fehlgeschlagen:");
      console.error("Fehlertyp:", typeof connError);
      console.error("Fehlermeldung:", connError.message);
      console.error("Stack:", connError.stack);
      
      if (connError.code) {
        console.error("Fehlercode:", connError.code);
      }
      
      throw new Error(`Datenbankverbindungsfehler: ${connError.message}`);
    }
    
    console.log("Initialisiere Drizzle ORM mit Pool...");
    db = drizzle({ client: pool, schema });
    console.log("PostgreSQL-Verbindung vollständig initialisiert");
    
    // Direkte Testquery mit Drizzle
    try {
      console.log("Teste Drizzle ORM...");
      const result = await db.select().from(schema.users).limit(1);
      console.log("Drizzle ORM Test erfolgreich, Benutzer gefunden:", result.length > 0);
    } catch (drizzleError: any) {
      console.error("Drizzle ORM Test fehlgeschlagen:", drizzleError.message);
      console.error("Stack:", drizzleError.stack);
    }
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
