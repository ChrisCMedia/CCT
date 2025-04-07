import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzleSQLite } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import ws from "ws";
import * as schema from "./shared/schema-basic.js";
import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { hashPassword } from './auth.js';

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
let wsProxyValue: string | undefined = undefined;
if (process.env.VERCEL === 'true' || process.env.VERCEL === '1') {
  wsProxyValue = process.env.VERCEL_URL || undefined;
}
console.log("WebSocket Proxy aktiviert:", !!wsProxyValue, "Wert:", wsProxyValue);
neonConfig.wsProxy = wsProxyValue;

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

let db: ReturnType<typeof drizzle> | undefined = undefined;
let pool: Pool | null = null;

// Stelle sicher, dass die DATABASE_URL Umgebungsvariable existiert
if (!process.env.DATABASE_URL) {
  console.error("FATAL: DATABASE_URL environment variable is not set!");
  throw new Error("DATABASE_URL environment variable is not set!");
}

try {
  console.log("Connecting to PostgreSQL database...");
  
  // Use DATABASE_URL (Pooler) for all environments now, including Vercel
  const connectionString = process.env.DATABASE_URL;
  
  console.log("Using connection type: Pooler (DATABASE_URL)");
  
  // Masked URL logging
  const urlParts = connectionString?.split('@');
  if (urlParts && urlParts.length > 1) {
    const hostPart = urlParts[1];
    console.log("Using connection URL: postgresql://[username]:[password]@" + hostPart);
  }
  
  console.log("Creating DB pool with options:");
  console.log("- connectionTimeoutMillis: 30000");
  console.log("- max Connections:", process.env.VERCEL ? 1 : 10); // Fewer connections on Vercel
  console.log("- idleTimeoutMillis: 15000");
  
  pool = new Pool({ 
    connectionString,
    connectionTimeoutMillis: 30000,
    max: process.env.VERCEL ? 1 : 10, 
    idleTimeoutMillis: 15000, 
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
} catch (error: any) {
  console.error("CRITICAL ERROR during database initialization:");
  console.error("Error Type:", typeof error);
  console.error("Error Message:", error.message);
  console.error("Stack Trace:", error.stack);
  
  if (error.code) {
    console.error("Error Code:", error.code);
  }
  
  // No SQLite fallback anymore, re-throw the error
  throw error; 
}

console.log("--- DB VERBINDUNGS-DEBUG ENDE ---");

export { db, pool };
