import { defineConfig } from "drizzle-kit";
import { existsSync } from 'fs';

// Bestimme Datenbank-URL basierend auf Umgebungsvariable
const dbUrl = process.env.DATABASE_URL || 'sqlite:./local_dev.db';
const isSQLite = dbUrl.startsWith('sqlite:');

// Konfiguration für SQLite oder PostgreSQL
export default defineConfig({
  schema: "./shared/schema.ts",
  out: "./drizzle",
  dialect: isSQLite ? 'sqlite' : 'postgresql',
  dbCredentials: isSQLite
    ? {
        url: dbUrl.replace('sqlite:', ''),
      }
    : {
        connectionString: dbUrl,
      },
});
