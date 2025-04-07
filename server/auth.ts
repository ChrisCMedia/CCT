import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { storage } from "./storage.js";

// Konvertiere callback-basiertes scrypt zu Promise-basiert
const scryptAsync = promisify(scrypt);

// Funktion zum Hashen von Passwörtern
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

// Funktion zum Vergleichen von Passwörtern
export async function comparePasswords(
  supplied: string,
  stored: string
): Promise<boolean> {
  try {
    console.log("Vergleiche Passwörter...");
    
    // Überprüfe, ob das gespeicherte Passwort ein Hash ist (sollte einen Punkt enthalten)
    if (!stored.includes('.')) {
      console.warn("Gespeichertes Passwort scheint kein Hash zu sein (kein Punkt gefunden)!");
      return false;
    }
    
    const [hashedPassword, salt] = stored.split(".");
    const buf = await scryptAsync(supplied, salt, 64) as Buffer;
    const suppliedHashed = buf.toString("hex");
    
    const match = hashedPassword === suppliedHashed;
    console.log("Passwort-Vergleich Ergebnis:", match);
    return match;
  } catch (error) {
    console.error("Fehler beim Passwort-Vergleich:", error);
    return false;
  }
}

export function setupAuth(app: Express, instanceStorage = storage) {
  console.log("Konfiguriere Authentifizierung...");

  // Verwende ausschließlich MemoryStore für Sessions, um Berechtigungsprobleme mit der user_sessions Tabelle zu umgehen
  const MemoryStore = session.MemoryStore;
  
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || 'entwicklungsgeheimnis123',
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore(),  // Verwende immer MemoryStore, um das Berechtigungsproblem zu umgehen
    cookie: {
      secure: app.get("env") === "production" ? true : false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 Stunden
      sameSite: app.get("env") === "production" ? 'none' : 'lax'
    }
  };

  if (app.get("env") === "production") {
    app.set("trust proxy", 1);
  }

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        console.log(`Passport LocalStrategy: Versuche Login für ${username}`);
        const user = await instanceStorage.getUserByUsername(username);

        if (!user) {
          console.log(`Passport LocalStrategy: Benutzer ${username} nicht gefunden`);
          return done(null, false, { message: "Ungültige Anmeldedaten" });
        }

        const passwordMatch = await comparePasswords(password, user.password);
        if (!passwordMatch) {
          console.log(`Passport LocalStrategy: Falsches Passwort für ${username}`);
          return done(null, false, { message: "Ungültige Anmeldedaten" });
        }

        console.log(`Passport LocalStrategy: Login erfolgreich für ${username}`);
        return done(null, user);
      } catch (error) {
        console.error("Fehler in Passport Strategy:", error);
        return done(error);
      }
    })
  );

  passport.serializeUser((user: any, done) => {
    console.log("serializeUser aufgerufen mit ID:", user.id);
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      console.log("deserializeUser aufgerufen mit ID:", id);
      const user = await instanceStorage.getUser(id);
      
      if (!user) {
        console.log("deserializeUser: Benutzer nicht gefunden für ID:", id);
        return done(null, false);
      }
      
      console.log("deserializeUser: Benutzer gefunden für ID:", id);
      done(null, user);
    } catch (error) {
      console.error("Fehler in deserializeUser:", error);
      done(error, null);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      console.log("Registrierungsversuch für:", req.body.username);
      console.log("Request-Körper:", JSON.stringify(req.body));
      
      if (!req.body.username || !req.body.password) {
        console.log("Registrierung fehlgeschlagen: Fehlende Daten");
        return res.status(400).json({ message: "Benutzername und Passwort sind erforderlich" });
      }

      const existingUser = await instanceStorage.getUserByUsername(req.body.username);
      if (existingUser) {
        console.log("Registrierung fehlgeschlagen: Benutzername existiert bereits");
        return res.status(400).json({ message: "Benutzername existiert bereits" });
      }

      const hashedPassword = await hashPassword(req.body.password);
      
      try {
        const user = await instanceStorage.createUser({
          username: req.body.username,
          password: hashedPassword
        });

        console.log("Benutzer erfolgreich erstellt mit ID:", user.id);
        
        req.login(user, (err) => {
          if (err) {
            console.error("Login nach Registrierung fehlgeschlagen:", err);
            return next(err);
          }
          console.log("Benutzer erfolgreich angemeldet nach Registrierung, Session-ID:", req.sessionID);
          const { password, ...userWithoutPassword } = user;
          res.status(201).json(userWithoutPassword);
        });
      } catch (dbError: any) {
        console.error("Datenbankfehler bei der Benutzerregistrierung:", dbError);
        if (dbError.code) {
          console.error("Datenbankfehlercode:", dbError.code);
        }
        if (dbError.constraint) {
          console.error("Verletzte Constraint:", dbError.constraint);
        }
        return res.status(500).json({ 
          message: "Registrierung fehlgeschlagen, Datenbankfehler", 
          error: dbError.message,
          code: dbError.code || 'unknown'
        });
      }
    } catch (error: any) {
      console.error("Allgemeiner Fehler bei der Registrierung:", error);
      res.status(500).json({ 
        message: "Registrierung fehlgeschlagen", 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  });

  app.post("/api/login", (req, res, next) => {
    console.log("=== LOGIN DEBUGGING ===");
    console.log("Login-Anfrage erhalten für:", req.body.username);
    console.log("Session ID:", req.sessionID);
    console.log("Request Headers:", JSON.stringify(req.headers, null, 2));
    console.log("Request Body:", JSON.stringify(req.body, null, 2));
    console.log("Datenbank verfügbar:", !!instanceStorage);
    
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        console.error("Passport-Authentifizierungsfehler:", err);
        return res.status(500).json({ 
          message: "Anmeldefehler", 
          error: err.message,
          stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
        });
      }
      
      if (!user) {
        console.log("Authentifizierung fehlgeschlagen:", info?.message);
        console.log("Info-Objekt:", JSON.stringify(info, null, 2));
        return res.status(401).json({ message: info?.message || "Ungültige Anmeldedaten" });
      }
      
      req.login(user, (loginErr) => {
        if (loginErr) {
          console.error("Session-Login-Fehler:", loginErr);
          return res.status(500).json({ 
            message: "Sitzungsfehler", 
            error: loginErr.message,
            stack: process.env.NODE_ENV !== 'production' ? loginErr.stack : undefined
          });
        }
        
        console.log("Login erfolgreich für Benutzer:", user.username, "Session ID:", req.sessionID);
        console.log("Benutzer-Objekt:", JSON.stringify(user, null, 2));
        
        const { password, ...userWithoutPassword } = user;
        return res.json(userWithoutPassword);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    console.log("Logout-Anfrage erhalten, Session-ID:", req.sessionID);
    
    req.logout((err) => {
      if (err) {
        console.error("Fehler beim Logout:", err);
        return next(err);
      }
      console.log("Benutzer abgemeldet, Session zerstört");
      return res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    console.log("User-Info-Anfrage, authentifiziert:", req.isAuthenticated(), "Session-ID:", req.sessionID);
    
    if (!req.isAuthenticated()) {
      console.log("Keine authentifizierte Session gefunden");
      return res.status(401).json({ message: "Nicht angemeldet" });
    }
    
    console.log("Benutzer angemeldet:", req.user);
    res.json(req.user);
  });
}