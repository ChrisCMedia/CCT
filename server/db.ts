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

if (process.env.DATABASE_URL) {
  // Maskiere sensible Daten, zeige aber das Format
  const urlParts = process.env.DATABASE_URL.split('@');
  if (urlParts.length > 1) {
    const hostPart = urlParts[1];
    console.log("DATABASE_URL Format: postgresql://[username]:[password]@" + hostPart);
  }
}

// In Vercel-Umgebung: WebSocket konfigurieren
if (process.env.VERCEL === 'true' || process.env.VERCEL === '1') {
  console.log("Konfiguriere Neon für Vercel-Umgebung...");
  
  // WebSocket-Konstruktor setzen
  neonConfig.webSocketConstructor = ws;
  
  // Wichtig: In Vercel kann der WebSocket-Proxy hilfreich sein
  // Wir verwenden zuerst direkte Verbindung und dann erst den Proxy als Fallback
  neonConfig.wsProxy = undefined; // Wir starten ohne Proxy
  
  // Verbindungs-Timeouts erhöhen (Beispielwerte)
  // neonConfig.connectionTimeoutMillis = 60000; // Ist nicht Teil der offiziellen neonConfig, kann über Pool-Optionen gesetzt werden
  (neonConfig as any).retryInterval = 1000;
  (neonConfig as any).retryLimit = 5;
  // console.log("Verbindungs-Timeouts angepasst:", (neonConfig as any).connectionTimeoutMillis, "ms"); // Entfernt, da nicht Teil von neonConfig
} else {
  // Für lokale Entwicklung
  console.log("Konfiguriere Neon für lokale Entwicklung...");
  neonConfig.webSocketConstructor = ws;
}

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
  console.log("Versuche direkte Verbindung zur PostgreSQL-Datenbank...");
  
  // Verwende die direkte Verbindungs-URL (ohne -pooler)
  let connectionString: string | undefined = process.env.DATABASE_URL;
  // Wenn wir auf Vercel sind und die URL den Pooler enthält, entferne ihn für den ersten Versuch
  if ((process.env.VERCEL === 'true' || process.env.VERCEL === '1') && connectionString?.includes("-pooler.")) {
    connectionString = connectionString.replace(/-pooler\./g, '.');
    console.log("Verwende direkte URL (ohne Pooler)");
  } else {
    console.log("Verwende Original-URL");
  }
  
  // Masked URL logging
  const urlParts = connectionString?.split('@');
  if (urlParts && urlParts.length > 1) {
    const hostPart = urlParts[1];
    console.log("Using connection URL: postgresql://[username]:[password]@" + hostPart);
  }
  
  console.log("Erstelle DB-Pool mit folgenden Optionen:");
  console.log("- connectionTimeoutMillis: 60000");
  console.log("- max Connections:", process.env.VERCEL ? 1 : 10);
  console.log("- idleTimeoutMillis: 30000");
  
  pool = new Pool({ 
    // Stelle sicher, dass connectionString ein String ist oder behandle den undefined-Fall
    connectionString: connectionString ?? '', // Leerer String als Fallback, wenn undefined (sollte nicht passieren wegen Prüfung oben)
    connectionTimeoutMillis: 60000,
    max: process.env.VERCEL ? 1 : 10, 
    idleTimeoutMillis: 30000, 
  });
  
  // Teste sofort die Verbindung mit Timeout
  try {
    console.log("Teste Datenbankverbindung...");
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Datenbankverbindungs-Timeout')), 20000);
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
    console.error("Direkte PostgreSQL-Verbindung fehlgeschlagen:");
    console.error("Fehlertyp:", typeof connError);
    console.error("Fehlermeldung:", connError.message);
    console.error("Stack:", connError.stack);
    
    if (connError.code) {
      console.error("Fehlercode:", connError.code);
    }
    
    // Versuche als Fallback den Pooler zu verwenden
    console.log("\n*** FALLBACK: Versuche Connection Pooler ***");
    try {
      // Verwende die originale URL mit Pooler
      const poolerString = process.env.DATABASE_URL;
      console.log("Verwende Pooler-URL:", "postgresql://[username]:[password]@" + poolerString.split('@')[1]);
      
      // WebSocket Proxy für Vercel aktivieren
      if (process.env.VERCEL === 'true' || process.env.VERCEL === '1') {
        const wsProxyValue = process.env.VERCEL_URL || undefined;
        console.log("WebSocket Proxy aktiviert:", !!wsProxyValue, "Wert:", wsProxyValue);
        (neonConfig as any).wsProxy = wsProxyValue; // Korrekter Zugriff auf wsProxy über neonConfig
      }
      
      pool = new Pool({ 
        connectionString: poolerString ?? '', // Fallback für undefined
        connectionTimeoutMillis: 60000,
        max: process.env.VERCEL ? 1 : 10, 
        idleTimeoutMillis: 30000, 
      });
      
      console.log("Teste Pooler-Datenbankverbindung...");
      const poolerResult = await pool.query('SELECT 1 as test');
      console.log("Pooler-PostgreSQL-Verbindung erfolgreich getestet:", JSON.stringify(poolerResult));
      
    } catch (poolerError: any) {
      console.error("Auch Pooler-PostgreSQL-Verbindung fehlgeschlagen:");
      console.error("Fehlertyp:", typeof poolerError);
      console.error("Fehlermeldung:", poolerError.message);
      console.error("Stack:", poolerError.stack);
      
      throw new Error(`Datenbankverbindungsfehler: ${connError.message}`);
    }
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
