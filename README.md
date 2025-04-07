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

## Deployment auf Vercel mit Neon PostgreSQL

### 1. Neon Datenbank einrichten
1. Registrieren Sie sich bei [Neon](https://neon.tech) und erstellen Sie ein kostenloses Projekt
2. Erstellen Sie eine neue Datenbank
3. Kopieren Sie die Verbindungs-URL (Connection String)

### 2. Vercel Projekt einrichten
1. Verbinden Sie das GitHub-Repository mit Vercel
2. Setzen Sie folgende Umgebungsvariablen:
   - `DATABASE_URL`: Ihre Neon-Datenbanks-URL
   - `SESSION_SECRET`: Ein starkes, zufälliges Passwort
3. Aktivieren Sie in den Projekteinstellungen die Option "Use Node.js Version from package.json"
4. Vercel wird automatisch die Build-Konfiguration aus vercel.json verwenden

### 3. Datenbank-Schema einrichten
Nach der ersten Bereitstellung müssen Sie das Datenbankschema initialisieren:
```bash
# Stellen Sie sicher, dass Sie die Umgebungsvariablen lokal gesetzt haben
npm install
npx drizzle-kit push
```

### 4. Genießen Sie Ihre bereitgestellte Anwendung!
Ihre Anwendung sollte nun auf der von Vercel bereitgestellten URL verfügbar sein.

# Client Communication Tool

Eine moderne Anwendung für die Verwaltung und Planung von Social-Media-Posts.

## Features

- Social Media Post Planer
- To-Do Verwaltung
- Newsletter Erstellung
- Benutzerauthentifizierung

## Update
- Verbesserte Bild-Upload-Funktionalität

## Datenbankverbindung aktualisiert
Die Anwendung ist jetzt mit einem speziellen Datenbankbenutzer konfiguriert für verbesserte Sicherheit. 