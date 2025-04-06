// Skript zum Aktualisieren des Admin-Passworts
// Dieses Skript verwendet die direkte Datenbankverbindung, um das Admin-Passwort zu aktualisieren
import { Pool } from '@neondatabase/serverless';
import ws from 'ws';
import * as dotenv from 'dotenv';

// Lade Umgebungsvariablen
dotenv.config();

// Konfiguriere WebSocket für Neon
const neonConfig = { webSocketConstructor: ws };

async function updateAdminPassword() {
  console.log("Starte Admin-Passwort-Update...");
  
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL ist nicht gesetzt!");
    process.exit(1);
  }
  
  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 30000
  });
  
  try {
    console.log("Verbindung zur Datenbank hergestellt");
    
    // Passwort, das wir erstellt haben
    const hashedPassword = "5610048446041c58c25782cb8d7d8276929614e1646434e7d4adee553af6128393c819d661611b73e158f55420160308cb588e9a5b07f644d7d21900d0c589ae.a028eeb022259b9a48fc7e8ac19a2fc2";
    
    // Prüfe, ob Admin-Benutzer existiert
    const adminCheck = await pool.query('SELECT * FROM users WHERE username = $1 LIMIT 1', ['admin']);
    
    if (adminCheck.rows.length === 0) {
      console.log("Admin-Benutzer existiert nicht, erstelle neuen Admin-Benutzer");
      await pool.query(
        'INSERT INTO users (username, password) VALUES ($1, $2)',
        ['admin', hashedPassword]
      );
      console.log("Admin-Benutzer erfolgreich erstellt!");
    } else {
      console.log("Admin-Benutzer existiert, aktualisiere Passwort");
      await pool.query(
        'UPDATE users SET password = $1 WHERE username = $2',
        [hashedPassword, 'admin']
      );
      console.log("Admin-Passwort erfolgreich aktualisiert!");
    }
    
    // Gebe alle Benutzer aus
    const users = await pool.query('SELECT id, username, password FROM users');
    console.log("Alle Benutzer in der Datenbank:", users.rows);
    
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Admin-Passworts:", error);
  } finally {
    await pool.end();
    console.log("Datenbankverbindung geschlossen");
  }
}

// Führe die Funktion aus
updateAdminPassword().then(() => {
  console.log("Skript beendet");
}).catch(err => {
  console.error("Unbehandelter Fehler:", err);
}); 