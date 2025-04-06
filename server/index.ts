import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { setupLinkedInAuth } from "./linkedin";
import cron from "node-cron";
import { storage } from "./storage";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";
import cors from "cors";
import { initializeDatabase } from "./dbInit";
import { configureAuth } from "./auth";

// Declare module für node-cron, um TypeScript-Fehler zu vermeiden
declare module 'node-cron';

// Prozessweite Fehlerbehandlung
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Beende den Prozess nicht, aber protokolliere den Fehler
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Protokolliere den Fehler, beende aber den Prozess nicht in Produktion
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

const execAsync = promisify(exec);

const app = express();

// CORS konfigurieren
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || true  // Erlaubt alle Ursprünge in Produktion, wenn FRONTEND_URL nicht gesetzt ist
    : 'http://localhost:5001',
  credentials: true, // Wichtig für Cookies und Authentifizierung
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging-Middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// NOTFALL-ROUTEN werden entfernt, da wir jetzt die richtige Authentifizierung haben
// app.get('/api/user', (req, res) => {
//   console.log('NOTFALL-ROUTE: /api/user');
//   return res.json({ id: 1, username: 'admin' });
// });

// app.post('/api/login', (req, res) => {
//   console.log('NOTFALL-ROUTE: /api/login');
//   return res.json({ id: 1, username: 'admin' });
// });

// app.get('/api/todos', (req, res) => {
//   console.log('NOTFALL-ROUTE: /api/todos');
//   return res.json([]);
// });

// app.get('/api/users', (req, res) => {
//   console.log('NOTFALL-ROUTE: /api/users');
//   return res.json([{ id: 1, username: 'admin' }]);
// });

// app.get('/api/social-accounts', (req, res) => {
//   console.log('NOTFALL-ROUTE: /api/social-accounts');
//   return res.json([]);
// });

// app.get('/api/posts', (req, res) => {
//   console.log('NOTFALL-ROUTE: /api/posts');
//   return res.json([]);
// });

// Automatisches wöchentliches Backup
async function createBackup() {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `backup-${timestamp}.sql`;
    const filePath = path.join("backups", fileName);

    // Stelle sicher, dass das Backup-Verzeichnis existiert
    if (!fs.existsSync("backups")) {
      fs.mkdirSync("backups", { recursive: true });
    }

    // Erstelle einen neuen Backup-Eintrag
    const backup = await storage.createBackup({
      fileName,
      fileSize: 0,
    });

    try {
      // Führe pg_dump aus
      const databaseUrl = process.env.DATABASE_URL;
      if (!databaseUrl) {
        throw new Error("DATABASE_URL ist nicht gesetzt");
      }

      await execAsync(`pg_dump "${databaseUrl}" > "${filePath}"`);

      // Aktualisiere den Backup-Status
      await storage.updateBackupStatus(backup.id, "completed");
      log(`Automatisches Backup erfolgreich erstellt: ${fileName}`);
    } catch (error: any) {
      log(`Fehler beim automatischen Backup: ${error.message}`);
      await storage.updateBackupStatus(backup.id, "failed", error.message);
    }
  } catch (error: any) {
    log(`Fehler beim Erstellen des Backup-Eintrags: ${error.message}`);
  }
}

// Plane wöchentliches Backup (jeden Sonntag um 3 Uhr morgens)
// Nur ausführen, wenn nicht auf Vercel
if (!process.env.VERCEL) {
  cron.schedule('0 3 * * 0', () => {
    log('Starte automatisches wöchentliches Backup...');
    createBackup();
  });
}

(async () => {
  log("Starting server initialization...");

  try {
    // Initialisiere die Datenbank vor dem Serverstart
    log("Initialisiere Datenbank...");
    try {
      await initializeDatabase();
      log("Datenbank erfolgreich initialisiert");
    } catch (dbInitError: any) {
      log(`Fehler bei der Datenbankinitialisierung: ${dbInitError.message}`);
      log(`Stack-Trace: ${dbInitError.stack}`);
      // In Produktion versuchen wir trotzdem weiterzumachen
      if (process.env.NODE_ENV !== 'production') {
        throw dbInitError; // In Entwicklung neu werfen
      }
    }

    // Versuch mit Try/Catch, die Routes zu registrieren
    let server;
    try {
      log("Versuche Routes zu registrieren...");
      server = registerRoutes(app);
      log("Routes erfolgreich registriert");
    } catch (routesError: any) {
      log(`FEHLER beim Registrieren der Routes: ${routesError.message}`);
      log(`Stack-Trace: ${routesError.stack}`);
      // Fallback auf Standard-HTTP-Server
      log("Verwende Standard-HTTP-Server als Fallback");
      const http = await import('http');
      server = http.createServer(app);
    }

    setupLinkedInAuth(app);

    // Auth-Konfiguration
    configureAuth(app, storage);

    // Globale Fehlerbehandlung
    app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      log(`Error occurred: ${err.stack || err.message}`);
      
      // Sende detaillierte Fehlerinformationen in Entwicklungsumgebung
      if (app.get("env") === "development") {
        return res.status(status).json({
          message,
          error: err.stack || err.toString(),
          path: req.path
        });
      }
      
      // In Produktion senden wir auch Stack-Traces in Logfiles, aber nicht zum Client
      console.error(`API Error (${status}) at ${req.path}:`, err.stack || err.message);
      
      // Sende nur grundlegende Fehlerinformationen in Produktion
      res.status(status).json({ 
        message, 
        error: process.env.NODE_ENV !== 'production' ? err.stack : undefined 
      });
    });

    if (app.get("env") === "development") {
      log("Setting up Vite in development mode...");
      await setupVite(app, server);
    } else {
      log("Setting up static serving for production...");
      serveStatic(app);
    }

    // Vercel verwendet PORT Umgebungsvariable oder 3000 als Standard
    const PORT = parseInt(process.env.PORT || '5001', 10);
    server.listen(PORT, "0.0.0.0", () => {
      log(`Server successfully started and listening on port ${PORT}`);
      log(`Environment: ${app.get("env")}`);
      log(`CORS: ${app.get("env") === 'production' ? 'Enabled for production domains' : 'Enabled for localhost'}`);
      log(`Database URL: ${process.env.DATABASE_URL ? 'Configured' : 'Not configured'}`);
    });

    // Nur in Produktionsumgebung Backup erstellen
    // Überspringen auf Vercel wegen Serverless-Architektur
    if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
      log("Erstelle initiales Backup...");
      await createBackup();
    } else {
      log("Überspringe Backup in Entwicklungsumgebung oder auf Vercel");
    }
  } catch (error: any) {
    log(`KRITISCHER FEHLER beim Serverstart: ${error}`);
    console.error("Stack-Trace:", error.stack);
    process.exit(1);
  }
})();