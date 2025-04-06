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
    await initializeDatabase();
    log("Datenbank erfolgreich initialisiert");

    const server = registerRoutes(app);
    setupLinkedInAuth(app);

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
      
      // Sende nur grundlegende Fehlerinformationen in Produktion
      res.status(status).json({ message });
    });

    if (app.get("env") === "development") {
      log("Setting up Vite in development mode...");
      await setupVite(app, server);
    } else {
      log("Setting up static serving for production...");
      serveStatic(app);
    }

    // Vercel verwendet PORT Umgebungsvariable oder 3000 als Standard
    const PORT = process.env.PORT || 5001;
    server.listen(PORT, "0.0.0.0", () => {
      log(`Server successfully started and listening on port ${PORT}`);
      log(`Environment: ${app.get("env")}`);
      log(`CORS: ${app.get("env") === 'production' ? 'Enabled for production domains' : 'Enabled for localhost'}`);
    });

    // Nur in Produktionsumgebung Backup erstellen
    // Überspringen auf Vercel wegen Serverless-Architektur
    if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
      log("Erstelle initiales Backup...");
      await createBackup();
    } else {
      log("Überspringe Backup in Entwicklungsumgebung oder auf Vercel");
    }
  } catch (error) {
    log(`Failed to start server: ${error}`);
    process.exit(1);
  }
})();