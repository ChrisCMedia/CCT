import { db, pool } from './db.js';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { migrate as pgMigrate } from 'drizzle-orm/neon-serverless/migrator';
import * as schema from './shared/schema.js';
import { sql } from 'drizzle-orm';
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { Pool } from "@neondatabase/serverless";
import { hashPassword } from "./auth.js";

// Funktion zum Hashen von Passwörtern (kopiert aus auth.ts)
const scryptAsync = promisify(scrypt);

async function hashPasswordLocal(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

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
      
      try {
        // Prüfe Verbindung zur Datenbank mit Timeout
        console.log("Teste Datenbankverbindung...");
        let connectionSuccessful = false;
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Datenbankverbindungs-Timeout')), 15000);
        });
        
        try {
          if (!db) {
            throw new Error('Datenbank-Objekt ist nicht initialisiert');
          }
          
          const testConnection = await Promise.race([
            db.execute(sql`SELECT 1 as test`),
            timeoutPromise
          ]);
          console.log("Datenbankverbindung erfolgreich hergestellt:", testConnection);
          connectionSuccessful = true;
          
          // Führe Drizzle-Migrationen aus
          console.log("Führe Drizzle-Migrationen aus...");
          try {
            if (process.env.NODE_ENV === 'production' && db) {
              await pgMigrate(db, { migrationsFolder: './drizzle' });
              console.log("Drizzle-Migrationen erfolgreich ausgeführt.");
            } else {
              console.log("Migrationen werden nur in der Produktionsumgebung ausgeführt.");
            }
          } catch (migrationError) {
            console.error("Fehler beim Ausführen der Drizzle-Migrationen:", migrationError);
            // Fahre fort, auch wenn die Migration fehlschlägt, da die Tabelle möglicherweise bereits aktuell ist
          }
          
          // Erstelle Demo-Benutzer nach der Migration
          console.log("Erstelle/Überprüfe Demo-Benutzer...");
          try {
            if (!db) {
              throw new Error('Datenbank-Objekt ist nicht initialisiert für Benutzererstellung');
            }
            // Prüfe, ob der Admin existiert
            const adminExistsResult = await db.execute(sql`SELECT 1 FROM users WHERE username = 'admin' LIMIT 1`);
            if (!(adminExistsResult && Array.isArray(adminExistsResult) && adminExistsResult.length > 0)) {
              console.log("Admin-Benutzer existiert nicht, erstelle ihn...");
              const hashedPassword = await hashPasswordLocal("admin123");
              console.log("Admin-Passwort gehasht:", hashedPassword);
              await db.execute(sql`
                INSERT INTO users (username, password)
                VALUES ('admin', ${hashedPassword});
              `);
              console.log("Demo-Benutzer erfolgreich erstellt.");
            } else {
              console.log("Admin-Benutzer existiert bereits.");
              // Optional: Prüfe und aktualisiere Passwort, falls nötig (wie im alten Code)
              const adminUser = await db.execute(sql`SELECT password FROM users WHERE username = 'admin' LIMIT 1`);
              if (adminUser && Array.isArray(adminUser) && adminUser.length > 0) {
                const user = adminUser[0];
                if (user && typeof user === 'object' && 'password' in user && 
                    typeof user.password === 'string' && !user.password.includes('.')) {
                  console.log("Admin-Benutzer hat kein gehashtes Passwort, aktualisiere...");
                  const hashedPassword = await hashPasswordLocal("admin123");
                  await db.execute(sql`
                    UPDATE users SET password = ${hashedPassword} 
                    WHERE username = 'admin'
                  `);
                  console.log("Admin-Passwort wurde aktualisiert");
                }
              }
            }
          } catch (userError) {
            console.error("Fehler beim Erstellen/Überprüfen des Demo-Benutzers:", userError);
          }
          
        } catch (connError) {
          console.error("Fehler bei der Datenbankverbindung:", connError);
          throw new Error(`Datenbankverbindungsfehler: ${connError instanceof Error ? connError.message : String(connError)}`);
        }
      } catch (dbConnError) {
        console.error("KRITISCHER FEHLER bei der PostgreSQL-Verbindung:", dbConnError);
        console.error("Stack-Trace:", dbConnError instanceof Error ? dbConnError.stack : String(dbConnError));
        throw new Error(`PostgreSQL-Verbindungsfehler: ${dbConnError instanceof Error ? dbConnError.message : String(dbConnError)}`);
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
    console.error("KRITISCHER FEHLER bei der Datenbankinitialisierung:", error);
    console.error("Stack-Trace:", error instanceof Error ? error.stack : String(error));
    
    // Werfe den Fehler weiter, damit der Server fehlschlägt, wenn die Datenbankinitialisierung fehlschlägt
    throw error;
  }
} 