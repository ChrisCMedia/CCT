import pg from 'pg';
const { Client } = pg;

// Mit dem neuen Benutzer verbinden
const appClient = new Client({
  connectionString: 'postgresql://vercel_app_user:npg_0dfMgc2AGnrl@ep-orange-night-a5s00gg8-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require'
});

async function testConnection() {
  try {
    console.log('Verbinde als App-Benutzer...');
    await appClient.connect();
    console.log('Verbindung erfolgreich hergestellt!');
    
    // Test-Query ausführen
    console.log('Führe Test-Query aus...');
    const result = await appClient.query('SELECT current_user, current_database();');
    console.log('Query-Ergebnis:', result.rows);
    
    // Tabellen auflisten
    console.log('\nListe alle Tabellen auf:');
    const tables = await appClient.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    if (tables.rows.length === 0) {
      console.log('Keine Tabellen gefunden.');
    } else {
      tables.rows.forEach(row => {
        console.log(`- ${row.table_name}`);
      });
    }
    
  } catch (error) {
    console.error('Fehler bei der Verbindung oder Query:', error);
  } finally {
    await appClient.end();
    console.log('Verbindung geschlossen.');
  }
}

testConnection(); 