import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";

// Einfache Express-Anwendung ohne externe Abhängigkeiten
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

// Einfache Log-Funktion
function log(message: string) {
  console.log(`[Server] ${message}`);
}

// Einfache API-Endpunkte
app.get('/api/user', (req, res) => {
  log('GET /api/user - Notfallmodus, gebe Admin-Benutzer zurück');
  return res.json({ id: 1, username: 'admin' });
});

app.post('/api/login', (req, res) => {
  log('POST /api/login - Notfallmodus, gebe Admin-Benutzer zurück');
  return res.json({ id: 1, username: 'admin' });
});

app.get('/api/todos', (req, res) => {
  log('GET /api/todos - Notfallmodus, gebe leere Liste zurück');
  return res.json([]);
});

app.get('/api/social-accounts', (req, res) => {
  log('GET /api/social-accounts - Notfallmodus, gebe Demo-Konten zurück');
  return res.json([
    { id: 1, name: "LinkedIn", userId: 1, url: "https://linkedin.com/in/example", username: "example_user" },
    { id: 2, name: "LinkedIn", userId: 1, url: "https://linkedin.com/in/example2", username: "example_user2" }
  ]);
});

app.get('/api/posts', (req, res) => {
  log('GET /api/posts - Notfallmodus, gebe Demo-Posts zurück');
  const now = new Date();
  return res.json([
    { id: 1, userId: 1, accountId: 1, content: "Demo Post 1", scheduledDate: now.toISOString(), status: "draft" },
    { id: 2, userId: 1, accountId: 2, content: "Demo Post 2", scheduledDate: now.toISOString(), status: "scheduled" }
  ]);
});

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

// Alle anderen Anfragen an die SPA weiterleiten
app.get('*', (req, res) => {
  // API-Anfragen nicht umleiten
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API endpoint not found' });
  }
  
  // SPA index.html ausliefern für Client-Routen
  res.sendFile(path.join(process.cwd(), 'dist', 'client', 'index.html'));
});

// Server starten
const PORT = parseInt(process.env.PORT || '5001', 10);
const http = require('http');
const server = http.createServer(app);

server.listen(PORT, "0.0.0.0", () => {
  log(`Server erfolgreich gestartet auf Port ${PORT}`);
  log(`Umgebung: ${process.env.NODE_ENV || 'development'}`);
});