import pg from 'pg';
const { Client } = pg;

// Mit dem Admin-Benutzer (neondb_owner) verbinden
const adminClient = new Client({
  connectionString: 'postgresql://neondb_owner:npg_1Ge8UJvCptni@ep-orange-night-a5s00gg8-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require'
});

async function grantPermissions() {
  try {
    console.log('Verbinde als Admin-Benutzer...');
    await adminClient.connect();
    console.log('Verbindung hergestellt!');

    // Berechtigungen für den neuen Benutzer setzen
    console.log('Erteile Berechtigungen für vercel_app_user...');
    
    // CONNECT-Berechtigung für die Datenbank
    await adminClient.query('GRANT CONNECT ON DATABASE neondb TO vercel_app_user;');
    console.log('✓ CONNECT-Berechtigung erteilt');
    
    // USAGE-Berechtigung für das Schema public
    await adminClient.query('GRANT USAGE ON SCHEMA public TO vercel_app_user;');
    console.log('✓ USAGE-Berechtigung erteilt');
    
    // Alle Rechte für existierende Tabellen
    await adminClient.query('GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO vercel_app_user;');
    console.log('✓ Tabellenberechtigungen erteilt');
    
    // Alle Rechte für Sequenzen
    await adminClient.query('GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO vercel_app_user;');
    console.log('✓ Sequenzberechtigungen erteilt');
    
    // Standardberechtigungen für neue Tabellen
    await adminClient.query('ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO vercel_app_user;');
    console.log('✓ Standardberechtigungen für neue Tabellen erteilt');
    
    // Standardberechtigungen für neue Sequenzen
    await adminClient.query('ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO vercel_app_user;');
    console.log('✓ Standardberechtigungen für neue Sequenzen erteilt');

    console.log('Alle Berechtigungen erfolgreich erteilt!');
  } catch (error) {
    console.error('Fehler beim Erteilen der Berechtigungen:', error);
  } finally {
    await adminClient.end();
    console.log('Verbindung geschlossen.');
  }
}

grantPermissions(); 