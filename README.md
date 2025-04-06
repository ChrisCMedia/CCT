# Social Media Management Tool

Eine Anwendung zur Verwaltung und Planung von Social-Media-Beiträgen.

## Features

- Beitragsverwaltung und -planung
- Unterstützung für LinkedIn
- Todo-Verwaltung
- Kommentarfunktion
- Archivierung älterer Beiträge
- Benutzerauthentifizierung

## Technologien

- Frontend: React, Vite, TypeScript
- Backend: Node.js, Express
- Datenbank: PostgreSQL mit Drizzle ORM
- Hosting: Vercel + Neon PostgreSQL

## Entwicklung

1. Repository klonen
2. Dependencies installieren: `npm install`
3. `.env`-Datei erstellen mit:
   ```
   DATABASE_URL=postgresql://...
   SESSION_SECRET=eingeheimnis
   ```
4. Entwicklungsserver starten: `npm run dev`

## Deployment

Die Anwendung ist konfiguriert für:
- Vercel (Application Hosting)
- Neon.tech (PostgreSQL-Datenbank) 