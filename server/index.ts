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
// User-Route
app.get('/api/user', (req, res) => {
  log('User-Info-Anfrage, authentifiziert: ' + req.isAuthenticated());
  
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Nicht angemeldet' });
  }
  
  return res.json(req.user);
});

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

// Füge einen Index-Endpunkt hinzu, der alle verfügbaren API-Endpunkte auflistet
app.get("/api", (req, res) => {
  const isAuthenticated = req.isAuthenticated();
  const apiEndpoints = [
    { path: "/api/users", method: "GET", description: "Liste aller Benutzer", auth: true },
    { path: "/api/user", method: "GET", description: "Aktuell angemeldeter Benutzer", auth: true },
    { path: "/api/login", method: "POST", description: "Benutzeranmeldung", auth: false },
    { path: "/api/register", method: "POST", description: "Benutzerregistrierung", auth: false },
    { path: "/api/logout", method: "POST", description: "Benutzerabmeldung", auth: true },
    
    { path: "/api/todos", method: "GET", description: "Liste aller Todos", auth: true },
    { path: "/api/todos", method: "POST", description: "Neues Todo erstellen", auth: true },
    { path: "/api/todos/:id", method: "PATCH", description: "Todo aktualisieren", auth: true },
    { path: "/api/todos/:id", method: "DELETE", description: "Todo löschen", auth: true },
    { path: "/api/todos/:todoId/subtasks", method: "POST", description: "Neue Subtask erstellen", auth: true },
    { path: "/api/subtasks/:id", method: "PATCH", description: "Subtask aktualisieren", auth: true },
    { path: "/api/subtasks/:id", method: "DELETE", description: "Subtask löschen", auth: true },
    
    { path: "/api/posts", method: "GET", description: "Liste aller Posts", auth: true },
    { path: "/api/posts", method: "POST", description: "Neuen Post erstellen", auth: true },
    { path: "/api/posts/:id", method: "PATCH", description: "Post aktualisieren", auth: true },
    { path: "/api/posts/:id/approve", method: "PATCH", description: "Post genehmigen", auth: true },
    { path: "/api/posts/:id/unapprove", method: "PATCH", description: "Post Genehmigung zurückziehen", auth: true },
    { path: "/api/posts/:id", method: "DELETE", description: "Post löschen", auth: true },
    { path: "/api/posts/:id/comments", method: "GET", description: "Post-Kommentare abrufen", auth: true },
    { path: "/api/posts/:id/comments", method: "POST", description: "Post-Kommentar erstellen", auth: true },
    { path: "/api/comments/:id", method: "DELETE", description: "Post-Kommentar löschen", auth: true },
    
    { path: "/api/newsletters", method: "GET", description: "Liste aller Newsletter", auth: true },
    { path: "/api/newsletters", method: "POST", description: "Neuen Newsletter erstellen", auth: true },
    { path: "/api/newsletters/:id", method: "PATCH", description: "Newsletter aktualisieren", auth: true },
    { path: "/api/newsletters/:id", method: "DELETE", description: "Newsletter löschen", auth: true },
    
    { path: "/api/social-accounts", method: "GET", description: "Liste aller Social-Media-Konten", auth: true },
    { path: "/api/social-accounts", method: "POST", description: "Neues Social-Media-Konto erstellen", auth: true },
    { path: "/api/social-accounts/:id", method: "DELETE", description: "Social-Media-Konto löschen", auth: true },
    
    { path: "/api/backups", method: "GET", description: "Liste aller Backups", auth: true },
    { path: "/api/backups", method: "POST", description: "Neues Backup erstellen", auth: true },
    
    // Test-Endpunkte
    { path: "/api/test-db", method: "GET", description: "Datenbank-Verbindung testen", auth: false },
    { path: "/api/test-db-all", method: "GET", description: "Teste Erstellung von Posts, Todos und Newsletter", auth: true }
  ];
  
  return res.json({
    message: "API-Index",
    isAuthenticated,
    endpoints: apiEndpoints.filter(endpoint => !endpoint.auth || isAuthenticated),
    authRequiredEndpoints: isAuthenticated ? [] : apiEndpoints.filter(endpoint => endpoint.auth).map(e => e.path)
  });
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