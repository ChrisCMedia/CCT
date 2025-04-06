import { neon, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Konfiguriere WebSocket für Neon
neonConfig.webSocketConstructor = ws;

// Verbindungsstring direkt verwenden
const connectionString = 'postgresql://neondb_owner:npg_i8hRevmGEd3A@ep-orange-night-a5s00gg8-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require';
const sql = neon(connectionString);

// Gehashtes Passwort für 'admin123'
const HASHED_PASSWORD = '5610048446041c58c25782cb8d7d8276929614e1646434e7d4adee553af6128393c819d661611b73e158f55420160308cb588e9a5b07f644d7d21900d0c589ae.a028eeb022259b9a48fc7e8ac19a2fc2';

async function main() {
  try {
    console.log('Teste Verbindung...');
    const testResult = await sql`SELECT 1 as test`;
    console.log('Verbindung erfolgreich:', testResult);
    
    // Admin-Benutzer überprüfen
    console.log('Prüfe Admin-Benutzer...');
    const users = await sql`SELECT id, username, password FROM users WHERE username = 'admin'`;
    
    if (users.length === 0) {
      console.log('Admin-Benutzer nicht gefunden, erstelle neuen Benutzer...');
      await sql`INSERT INTO users (username, password) VALUES ('admin', ${HASHED_PASSWORD})`;
      console.log('Admin-Benutzer erfolgreich erstellt!');
    } else {
      console.log('Admin-Benutzer gefunden, aktualisiere Passwort...');
      await sql`UPDATE users SET password = ${HASHED_PASSWORD} WHERE username = 'admin'`;
      console.log('Admin-Passwort erfolgreich aktualisiert!');
    }
    
    // Zum Testen alle Benutzer anzeigen
    const allUsers = await sql`SELECT id, username FROM users`;
    console.log('Alle Benutzer in der Datenbank:', allUsers);
    
    console.log('Fertig!');
  } catch (error) {
    console.error('Fehler:', error);
  }
}

main(); 