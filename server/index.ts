import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import passport from "passport";
import session from "express-session";
import { initializeDatabase } from "./dbInit";
import { setupAuth } from "./auth";
import { storage } from "./storage";

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
// Todo-Routen
app.get('/api/todos', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Nicht angemeldet' });
  }
  
  try {
    const todos = await storage.getTodos();
    return res.json(todos);
  } catch (error) {
    log(`Fehler beim Abrufen der Todos: ${error}`);
    return res.status(500).json({ message: 'Fehler beim Abrufen der Todos' });
  }
});

// Social-Accounts-Routen
app.get('/api/social-accounts', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Nicht angemeldet' });
  }
  
  try {
    const accounts = await storage.getSocialAccounts();
    return res.json(accounts);
  } catch (error) {
    log(`Fehler beim Abrufen der Social-Accounts: ${error}`);
    return res.status(500).json({ message: 'Fehler beim Abrufen der Social-Accounts' });
  }
});

// Posts-Routen
app.get('/api/posts', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Nicht angemeldet' });
  }
  
  try {
    const posts = await storage.getPosts();
    return res.json(posts);
  } catch (error) {
    log(`Fehler beim Abrufen der Posts: ${error}`);
    return res.status(500).json({ message: 'Fehler beim Abrufen der Posts' });
  }
});

// Alle anderen Anfragen an die SPA weiterleiten
app.get('*', (req, res) => {
  // API-Anfragen nicht umleiten
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API endpoint not found' });
  }
  
  // SPA index.html ausliefern für Client-Routen
  res.sendFile(path.join(process.cwd(), 'dist', 'client', 'index.html'));
});

// Datenbank initialisieren und Server starten
async function startServer() {
  try {
    log('Initialisiere Datenbank...');
    await initializeDatabase();
    log('Datenbank erfolgreich initialisiert');
    
    // Server starten
    const PORT = parseInt(process.env.PORT || '5001', 10);
    const http = require('http');
    const server = http.createServer(app);
    
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