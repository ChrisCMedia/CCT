import pg from 'pg';
import ws from 'ws';
import { neonConfig } from '@neondatabase/serverless';
const { Client } = pg;

// Test direkter WebSocket-Verbindung
async function testWebsocketConnection() {
  try {
    console.log('Teste WebSocket-Verbindung mit Neon...');
    
    // Konfiguriere WebSocket
    neonConfig.webSocketConstructor = ws;
    
    // Vercel-WebSocket-Proxy deaktivieren für lokalen Test
    neonConfig.wsProxy = undefined;
    
    // Direkte Verbindung, nicht über Pooler
    const connectionString = 'postgresql://vercel_app_user:npg_0dfMgc2AGnrl@ep-orange-night-a5s00gg8.us-east-2.aws.neon.tech/neondb?sslmode=require';
    
    // Mit Client verbinden
    const client = new Client({ connectionString });
    
    console.log('Stelle Verbindung her...');
    await client.connect();
    console.log('Verbindung erfolgreich hergestellt!');
    
    // Test-Query ausführen
    console.log('Führe Test-Query aus...');
    const result = await client.query('SELECT current_user, current_database()');
    console.log('Query-Ergebnis:', result.rows[0]);
    
    await client.end();
    console.log('Verbindung geschlossen.');
  } catch (error) {
    console.error('Fehler beim Testen der WebSocket-Verbindung:', error);
  }
}

testWebsocketConnection(); 