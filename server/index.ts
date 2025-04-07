import 'tsconfig-paths/register.js';
import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import passport from "passport";
import session from "express-session";
import http from 'http';
import { initializeDatabase } from "./dbInit.js";
import { setupAuth } from "./auth.js";
import { storage } from "./storage.js";
import { registerRoutes } from "./routes.js";

// Express-Anwendung initialisieren
const app = express();

// CORS konfigurieren
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Log-Funktion
function log(message: string) {
  console.log(`[Server] ${message}`);
}

// Fehlerbehandlung
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  log(`Error occurred: ${err.stack || err.message}`);
  
  res.status(status).json({ 
    message, 
    error: process.env.NODE_ENV !== 'production' ? err.stack : undefined 
  });
});

// Statische Dateien bereitstellen
app.use(express.static(path.join(process.cwd(), 'dist', 'client')));

// Authentifizierung einrichten
setupAuth(app);

// API-Routen registrieren
const server = registerRoutes(app);

// Alle anderen Anfragen an die SPA weiterleiten
app.get('*', (req, res) => {
  // API-Anfragen nicht umleiten
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API endpoint not found' });
  }
  
  // SPA index.html ausliefern für Client-Routen
  res.sendFile(path.join(process.cwd(), 'dist', 'client', 'index.html'));
});

// Vorgegebene Social Media Accounts erstellen, falls sie nicht existieren
async function createDefaultSocialAccounts() {
  try {
    log('Erstelle vordefinierte Social Media Accounts, falls nicht vorhanden...');
    const accounts = await storage.getSocialAccounts();
    
    // Admin-Benutzer abrufen
    const admin = await storage.getUserByUsername('admin');
    if (!admin) {
      log('Admin-Benutzer existiert nicht, kann keine Standardkonten erstellen');
      return;
    }
    
    // Prüfe, ob "YOUR TIMES" bereits existiert
    const yourTimesExists = accounts.some(account => 
      account.accountName.toLowerCase() === 'your times');
    
    // Prüfe, ob "Judith Lenz" bereits existiert
    const judithLenzExists = accounts.some(account => 
      account.accountName.toLowerCase() === 'judith lenz');
    
    // Erstelle "YOUR TIMES", falls nicht vorhanden
    if (!yourTimesExists) {
      log('Erstelle YOUR TIMES Account...');
      await storage.createSocialAccount({
        platform: "LinkedIn",
        accountName: "YOUR TIMES",
        userId: admin.id
      });
      log('YOUR TIMES Account erstellt');
    }
    
    // Erstelle "Judith Lenz", falls nicht vorhanden
    if (!judithLenzExists) {
      log('Erstelle Judith Lenz Account...');
      await storage.createSocialAccount({
        platform: "LinkedIn",
        accountName: "Judith Lenz",
        userId: admin.id
      });
      log('Judith Lenz Account erstellt');
    }
    
    log('Vordefinierte Social Media Accounts überprüft.');
  } catch (error) {
    log(`Fehler beim Erstellen der vordefinierten Accounts: ${error}`);
    console.error(error);
  }
}

// Datenbank initialisieren und Server starten
async function startServer() {
  try {
    log('Initialisiere Datenbank...');
    await initializeDatabase();
    log('Datenbank erfolgreich initialisiert');
    
    // Erstelle vordefinierte Social Media Accounts
    await createDefaultSocialAccounts();
    
    // Server starten
    const PORT = parseInt(process.env.PORT || '5001', 10);
    
    server.listen(PORT, "0.0.0.0", () => {
      log(`Server erfolgreich gestartet auf Port ${PORT}`);
      log(`Umgebung: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    log(`KRITISCHER FEHLER beim Serverstart: ${error}`);
    console.error(error);
    process.exit(1);
  }
}

// Server starten
startServer().catch(error => {
  log(`KRITISCHER FEHLER: ${error}`);
  console.error(error);
  process.exit(1);
});