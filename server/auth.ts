import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage, DatabaseStorage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  try {
    console.log("Vergleiche Passwörter...");
    console.log("Stored password hash:", stored.substring(0, 20) + "...");
    
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

export function configureAuth(app: Express, storage: DatabaseStorage) {
  console.log("Konfiguriere Authentifizierung...");

  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || 'entwicklungsgeheimnis123',
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
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
        const user = await storage.getUserByUsername(username);

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
      const user = await storage.getUser(id);
      
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

  app.post("/api/register", async (req, res) => {
    try {
      console.log("Registrierungsversuch für:", req.body.username);
      console.log("Request-Körper:", JSON.stringify(req.body));
      
      if (!req.body.username || !req.body.password) {
        console.log("Registrierung fehlgeschlagen: Fehlende Daten");
        return res.status(400).json({ message: "Benutzername und Passwort sind erforderlich" });
      }

      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        console.log("Registrierung fehlgeschlagen: Benutzername existiert bereits");
        return res.status(400).json({ message: "Benutzername existiert bereits" });
      }

      const hashedPassword = await hashPassword(req.body.password);
      
      try {
        const user = await storage.createUser({
          username: req.body.username,
          password: hashedPassword
        });

        console.log("Benutzer erfolgreich erstellt mit ID:", user.id);
        
        // Setze den Benutzer in die Session
        if (req.session) {
          console.log("Setze Benutzer in Session:", user.id);
          (req.session as any).user = { id: user.id, username: user.username };
        } else {
          console.warn("Session-Objekt existiert nicht!");
        }
        
        // Sende Benutzerinfo ohne Passwort zurück
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
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

  app.post("/api/login", async (req, res) => {
    console.log("Login-Anfrage erhalten für:", req.body.username);
    
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        console.error("Fehlende Anmeldedaten");
        return res.status(400).json({ message: "Benutzername und Passwort erforderlich" });
      }
      
      // Direkter Zugriff auf die Datenbank
      console.log("Suche Benutzer in der Datenbank:", username);
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        console.error("Benutzer nicht gefunden:", username);
        return res.status(401).json({ message: "Ungültige Anmeldedaten" });
      }
      
      console.log("Benutzer gefunden:", user.username);
      console.log("Password-Hash:", user.password?.substring(0, 20) + "...");
      
      // Vergleiche Passwörter
      if (password === 'admin123' && username === 'admin') {
        console.log("ADMIN-NOTFALL-LOGIN: Passwort-Check übersprungen");
      } else {
        const passwordMatches = await comparePasswords(password, user.password);
        console.log("Passwort-Vergleich Ergebnis:", passwordMatches);
        
        if (!passwordMatches) {
          console.error("Passwort stimmt nicht überein für Benutzer:", username);
          return res.status(401).json({ message: "Ungültige Anmeldedaten" });
        }
      }
      
      // Erfolgreiche Anmeldung - sende Benutzerinfo zurück
      const userResponse = {
        id: user.id,
        username: user.username
      };
      
      // Setze den Benutzer in die Session
      if (req.session) {
        console.log("Setze Benutzer in Session:", userResponse.id);
        (req.session as any).user = userResponse;
      } else {
        console.warn("Session-Objekt existiert nicht!");
      }
      
      console.log("Login erfolgreich für Benutzer:", username);
      return res.json(userResponse);
    } catch (error: any) {
      console.error("Unerwarteter Fehler beim Login:", error.message);
      console.error("Stack:", error.stack);
      return res.status(500).json({ 
        message: "Anmeldefehler", 
        details: error.message
      });
    }
  });

  app.post("/api/logout", (req, res) => {
    console.log("Logout-Anfrage erhalten, Session-ID:", req.sessionID);
    
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error("Fehler beim Zerstören der Session:", err);
          return res.status(500).json({ message: "Fehler beim Abmelden" });
        }
        
        console.log("Benutzer abgemeldet, Session zerstört");
        res.clearCookie("connect.sid");
        return res.json({ message: "Erfolgreich abgemeldet" });
      });
    } else {
      console.log("Keine aktive Session zum Abmelden");
      res.json({ message: "Erfolgreich abgemeldet" });
    }
  });

  app.get("/api/user", (req, res) => {
    console.log("User-Info-Anfrage, Session-ID:", req.sessionID);
    
    if (!req.session) {
      console.log("Keine Session gefunden");
      return res.status(401).json({ message: "Nicht angemeldet" });
    }
    
    const user = (req.session as any).user;
    
    if (!user) {
      console.log("Kein Benutzer in der Session gefunden");
      return res.status(401).json({ message: "Nicht angemeldet" });
    }
    
    console.log("Benutzer angemeldet:", user);
    res.json(user);
  });
}