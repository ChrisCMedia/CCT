import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
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
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      done(error);
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

      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        console.log("Registrierung fehlgeschlagen: Benutzername existiert bereits");
        return res.status(400).json({ message: "Benutzername existiert bereits" });
      }

      const hashedPassword = await hashPassword(req.body.password);
      
      const user = await storage.createUser({
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
    } catch (error) {
      console.error("Fehler bei der Registrierung:", error);
      res.status(500).json({ message: "Registrierung fehlgeschlagen", error: error.message });
    }
  });

  app.post("/api/login", (req, res) => {
    try {
      console.log("Login-Versuch für:", req.body.username);
      console.log("Request-Körper:", JSON.stringify(req.body));
      
      if (!req.body.username || !req.body.password) {
        console.log("Login fehlgeschlagen: Fehlende Daten");
        return res.status(400).json({ message: "Benutzername und Passwort sind erforderlich" });
      }
      
      passport.authenticate("local", (err, user, info) => {
        if (err) {
          console.error("Passport Auth Fehler:", err);
          return res.status(500).json({ message: "Authentifizierungsfehler", error: err.message });
        }
        
        if (!user) {
          console.log("Login fehlgeschlagen: Ungültige Anmeldeinformationen");
          return res.status(401).json({ message: "Ungültige Anmeldeinformationen" });
        }
        
        req.login(user, (err) => {
          if (err) {
            console.error("Login-Sitzung konnte nicht erstellt werden:", err);
            return res.status(500).json({ message: "Sitzung konnte nicht erstellt werden", error: err.message });
          }
          
          console.log("Login erfolgreich für Benutzer:", user.id);
          console.log("Session-ID:", req.sessionID);
          const { password, ...userWithoutPassword } = user;
          return res.status(200).json(userWithoutPassword);
        });
      })(req, res);
    } catch (error) {
      console.error("Unerwarteter Fehler beim Login:", error);
      res.status(500).json({ message: "Login fehlgeschlagen", error: error.message });
    }
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}