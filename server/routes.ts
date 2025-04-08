import { createServer, type Server } from "http";
import { setupAuth } from "./auth.js";
import { storage } from "./storage.js";
import multer from "multer";
import path from "path";
import express from "express";
import { users } from "./shared/schema-basic.js";
import { insertNewsletterSchema, insertSocialAccountSchema } from "./shared/schema.js";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import { db, executeDirectQuery } from "./db.js";
import { mkdir, writeFile, readFile, unlink } from "fs/promises";

const execAsync = promisify(exec);

// Überprüfe, ob das Uploads-Verzeichnis existiert, wenn nicht, erstelle es
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  try {
    console.log("Erstelle Uploads-Verzeichnis:", uploadsDir);
    fs.mkdirSync(uploadsDir, { recursive: true });
    
    // In Produktionsumgebungen: Stelle sicher, dass die Berechtigungen stimmen
    if (process.platform !== 'win32') { // Nur auf Unix-basierten Systemen
      try {
        fs.chmodSync(uploadsDir, 0o755); // rwxr-xr-x
        console.log("Berechtigungen für Uploads-Verzeichnis gesetzt");
      } catch (permErr) {
        console.error("Konnte Berechtigungen für Uploads-Verzeichnis nicht setzen:", permErr);
      }
    }
    
    console.log("Uploads-Verzeichnis erfolgreich erstellt");
  } catch (err) {
    console.error("Fehler beim Erstellen des Uploads-Verzeichnisses:", err);
    console.error("Arbeitsverzeichnis:", process.cwd());
    // Versuche einen alternativen Pfad
    const altUploadsDir = path.join(__dirname, "..", "uploads");
    console.log("Versuche alternatives Uploads-Verzeichnis:", altUploadsDir);
    if (!fs.existsSync(altUploadsDir)) {
      try {
        fs.mkdirSync(altUploadsDir, { recursive: true });
        console.log("Alternatives Uploads-Verzeichnis erstellt:", altUploadsDir);
      } catch (altErr) {
        console.error("Konnte auch alternatives Uploads-Verzeichnis nicht erstellen:", altErr);
      }
    }
  }
} else {
  console.log("Uploads-Verzeichnis existiert bereits:", uploadsDir);
  // Versuche Schreibberechtigungen zu prüfen
  try {
    const testFile = path.join(uploadsDir, '.write-test');
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
    console.log("Uploads-Verzeichnis ist beschreibbar");
  } catch (err) {
    console.error("WARNUNG: Uploads-Verzeichnis existiert, ist aber möglicherweise nicht beschreibbar:", err);
  }
}

// Konfiguriere Multer für das Speichern im Speicher statt im Dateisystem
const storage_config = multer.memoryStorage();

const upload = multer({
  storage: storage_config,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (_req, file, cb) => {
    // Erweiterte Liste erlaubter Dateitypen
    const allowedTypes = [
      "image/jpeg", 
      "image/png", 
      "image/gif", 
      "image/webp", 
      "image/svg+xml",
      "image/bmp"
    ];
    
    console.log("Überprüfe Dateityp:", file.mimetype);
    
    if (!allowedTypes.includes(file.mimetype)) {
      console.error("Unerlaubter Dateityp:", file.mimetype);
      return cb(new Error(`Dateityp nicht erlaubt. Erlaubte Typen: ${allowedTypes.join(', ')}`));
    }
    cb(null, true);
  },
});

// Multer-Middleware mit Fehlerbehandlung
const handleMulterError = (err: Error | null, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof multer.MulterError) {
    // MulterError-spezifische Fehler
    console.error("Multer-Fehler:", err.code, err.message);
    return res.status(400).json({ message: `Upload-Fehler: ${err.message}` });
  } else if (err) {
    // Sonstiger Fehler
    console.error("Fehler beim Datei-Upload:", err);
    return res.status(500).json({ message: err.message || "Fehler beim Hochladen der Datei" });
  }
  next();
};

export function registerRoutes(app: express.Application): Server {
  setupAuth(app);

  // Registriere den Multer-Fehlerhandler
  app.use(handleMulterError);

  // Serve uploaded files mit CORS und Cache-Control
  app.use("/uploads", express.static("uploads", {
    maxAge: '1d', // Cache für einen Tag
    setHeaders: (res, path) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
  }));

  // Get all users for assignment
  app.get("/api/users", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const users = await storage.getUsers();
      // Remove passwords from response
      const safeUsers = users.map(({ password, ...user }) => user);
      res.json(safeUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Todo routes
  app.get("/api/todos", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const todos = await storage.getTodos();
      res.json(todos);
    } catch (error) {
      console.error("Error fetching todos:", error);
      res.status(500).json({ message: "Failed to fetch todos" });
    }
  });

  app.post("/api/todos", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Nicht angemeldet' });
    }
    
    try {
      // Einfache Validierung
      if (!req.body.title) {
        return res.status(400).json({ message: 'Titel ist erforderlich' });
      }

      // Deadline-Verarbeitung
      let deadline = undefined;
      if (req.body.deadline) {
        try {
          deadline = new Date(req.body.deadline);
          if (isNaN(deadline.getTime())) {
            console.error("Ungültiges Deadline-Format:", req.body.deadline);
            return res.status(400).json({ message: 'Ungültiges Deadline-Format' });
          }
          console.log("Verarbeitete Deadline:", deadline);
        } catch (error) {
          console.error("Fehler bei der Verarbeitung der Deadline:", error);
          return res.status(400).json({ message: 'Ungültiges Deadline-Format' });
        }
      }
      
      // Füge den Benutzer zur Todo hinzu
      const todoData = {
        ...req.body,
        userId: (req.user as any).id,
        deadline: deadline
      };
      
      console.log("Erstelle Todo mit Daten:", JSON.stringify({
        ...todoData,
        deadline: todoData.deadline ? todoData.deadline.toISOString() : null
      }));
      
      const newTodo = await storage.createTodo(todoData);
      console.log("Todo erfolgreich erstellt:", newTodo.id);
      return res.status(201).json(newTodo);
    } catch (error) {
      console.error('Fehler beim Erstellen eines Todos:', error);
      return res.status(500).json({ message: 'Fehler beim Erstellen eines Todos' });
    }
  });

  app.patch("/api/todos/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const todo = await storage.updateTodo(Number(req.params.id), {
        completed: req.body.completed,
        deadline: req.body.deadline ? new Date(req.body.deadline) : undefined,
        assignedToUserId: req.body.assignedToUserId,
      });
      res.json(todo);
    } catch (error) {
      console.error("Error updating todo:", error);
      res.status(500).json({ message: "Failed to update todo" });
    }
  });

  app.delete("/api/todos/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      await storage.deleteTodo(Number(req.params.id));
      res.sendStatus(200);
    } catch (error) {
      console.error("Error deleting todo:", error);
      res.status(500).json({ message: "Failed to delete todo" });
    }
  });

  // New Subtask-Routes
  app.post("/api/todos/:todoId/subtasks", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const subtask = await storage.createSubtask({
        title: req.body.title,
        todoId: Number(req.params.todoId),
      });
      res.json(subtask);
    } catch (error) {
      console.error("Error creating subtask:", error);
      res.status(500).json({ message: "Failed to create subtask" });
    }
  });

  app.patch("/api/subtasks/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const subtask = await storage.updateSubtask(
        Number(req.params.id),
        req.body.completed
      );
      res.json(subtask);
    } catch (error) {
      console.error("Error updating subtask:", error);
      res.status(500).json({ message: "Failed to update subtask" });
    }
  });

  app.delete("/api/subtasks/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      await storage.deleteSubtask(Number(req.params.id));
      res.sendStatus(200);
    } catch (error) {
      console.error("Error deleting subtask:", error);
      res.status(500).json({ message: "Failed to delete subtask" });
    }
  });


  // Post routes
  app.get("/api/posts", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const posts = await storage.getPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.post("/api/posts", 
    // Multer-Middleware mit Fehlerbehandlung
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
      upload.single("image")(req, res, (err: any) => {
        if (err) {
          console.error("Fehler beim Upload:", err);
          if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
              return res.status(413).json({ 
                message: "Datei ist zu groß. Maximale Größe ist 5MB." 
              });
            }
            return res.status(400).json({ 
              message: `Upload-Fehler: ${err.message}` 
            });
          }
          return res.status(400).json({ 
            message: err.message || "Fehler beim Hochladen der Datei" 
          });
        }
        next();
      });
    },
    async (req: express.Request, res: express.Response) => {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      try {
        console.log("Post-Erstellungsanfrage erhalten:", req.body);
        console.log("Dateiinformationen:", req.file || "Keine Datei hochgeladen");
        
        let imageUrl: string | undefined = undefined;
        let imageData: string | undefined = undefined;
        
        if (req.file) {
          try {
            // Konvertiere das Bild in einen Base64-String
            const fileBuffer = req.file.buffer;
            const fileType = req.file.mimetype;
            const base64Image = fileBuffer.toString('base64');
            imageData = `data:${fileType};base64,${base64Image}`;
            console.log("Bild als Base64 konvertiert");
            
            // Logge die ersten 100 Zeichen des Base64-Strings zur Überprüfung
            console.log("Base64-Bildvorschau (gekürzt):", imageData.substring(0, 100) + "...");
          } catch (imageError) {
            console.error("Fehler bei der Bildkonvertierung:", imageError);
            // Fehler bei der Bildverarbeitung führt nicht zum Abbruch des gesamten Requests
          }
        }

        // Extrahiere accountId aus der Anfrage
        let accountId = null;
        if (req.body.accountIds) {
          if (Array.isArray(req.body.accountIds)) {
            accountId = Number(req.body.accountIds[0]);
            console.log("AccountId aus Array:", accountId);
          } else if (typeof req.body.accountIds === 'string') {
            // Wenn es ein String ist, versuche zu parsen (könnte ein JSON-Array sein)
            try {
              const accountIdsArray = JSON.parse(req.body.accountIds);
              accountId = Number(accountIdsArray[0]);
              console.log("AccountId aus JSON-String:", accountId);
            } catch (e) {
              // Versuche es mit dem accountIds[]-Format, das häufig bei FormData verwendet wird
              if (req.body['accountIds[]']) {
                // Verarbeite 'accountIds[]' als Array, falls es mehrere Einträge gibt
                if (Array.isArray(req.body['accountIds[]'])) {
                  accountId = Number(req.body['accountIds[]'][0]);
                  console.log("AccountId aus accountIds[]-Array:", accountId);
                } else {
                  // Falls es ein einzelner Wert ist
                  accountId = Number(req.body['accountIds[]']);
                  console.log("AccountId aus accountIds[]-Feld:", accountId);
                }
              } else {
                // Falls es ein einzelner String ist, versuche ihn direkt zu konvertieren
                accountId = Number(req.body.accountIds);
                console.log("AccountId aus einfachem String:", accountId);
              }
            }
          }
        }

        // Fallback auf accountId Feld, falls vorhanden
        if (!accountId && req.body.accountId) {
          accountId = Number(req.body.accountId);
          console.log("AccountId aus direktem Feld:", accountId);
        }

        // Falls keine accountId gefunden wurde, verwende Standard-Account 1
        if (!accountId) {
          accountId = 1; // Standard-Account (LinkedIn Demo Account)
          console.log("Verwende Standard-AccountId:", accountId);
        }

        // Validiere das Datum
        let scheduledDate;
        try {
          scheduledDate = new Date(req.body.scheduledDate);
          if (isNaN(scheduledDate.getTime())) {
            throw new Error("Ungültiges Datum");
          }
          console.log("Validiertes Datum:", scheduledDate);
        } catch (error) {
          console.error("Fehler beim Parsen des Datums:", error, req.body.scheduledDate);
          return res.status(400).json({ message: "Ungültiges Datum" });
        }

        // Validiere content (mindestens ein Zeichen)
        if (!req.body.content || req.body.content.trim() === '') {
          return res.status(400).json({ message: "Der Post-Inhalt darf nicht leer sein" });
        }

        const postData = {
          content: req.body.content,
          scheduledDate: scheduledDate,
          accountId: accountId,
          imageData, // Base64-Bild in der Datenbank speichern statt Dateipfad
          userId: (req.user as any).id,
        };

        console.log("Erstelle Post mit Daten:", { 
          ...postData, 
          imageData: postData.imageData ? "Base64-Daten (gekürzt)" : null 
        });
        
        try {
          // Zusätzliche Protokollierung für die Diagnose
          console.log("Umgebungsinfo:", {
            nodeEnv: process.env.NODE_ENV,
            vercelEnv: process.env.VERCEL_ENV,
            postgresMigrationAktiviert: !!process.env.POSTGRES_MIGRATE,
          });
          
          const post = await storage.createPost(postData);
          console.log("Post erfolgreich erstellt:", post.id);
          
          // Wenn wir accountIds[] als Array haben, erstelle Einträge in der post_accounts Tabelle
          // für alle weiteren Accounts (der erste wurde bereits beim Post gespeichert)
          if (req.body['accountIds[]'] && Array.isArray(req.body['accountIds[]']) && req.body['accountIds[]'].length > 1) {
            try {
              // Starte bei Index 1, da der erste Account bereits im Post-Datensatz gespeichert ist
              for (let i = 1; i < req.body['accountIds[]'].length; i++) {
                const additionalAccountId = Number(req.body['accountIds[]'][i]);
                if (!isNaN(additionalAccountId)) {
                  await executeDirectQuery(
                    'INSERT INTO post_accounts (post_id, account_id) VALUES ($1, $2)',
                    [post.id, additionalAccountId]
                  );
                  console.log(`Zusätzlichen Account ${additionalAccountId} für Post ${post.id} verknüpft`);
                }
              }
            } catch (postAccountError) {
              console.error("Fehler beim Verknüpfen zusätzlicher Accounts:", postAccountError);
              // Wir lassen den Fehler nicht zum Client durchdringen
            }
          }
          
          res.json(post);
        } catch (dbError: unknown) {
          console.error("Datenbankfehler beim Erstellen des Posts:", dbError);
          
          // Detailliertere Fehlerinformationen erfassen
          const errorInfo = {
            message: "Der Post konnte nicht erstellt werden", 
            error: dbError instanceof Error ? dbError.message : String(dbError),
            details: "Datenbankfehler beim Speichern des Posts",
            code: (dbError as any)?.code,
            sqlState: (dbError as any)?.sqlState,
            hint: (dbError as any)?.hint,
            errorPosition: (dbError as any)?.position
          };
          
          console.error("Vollständige Fehlerinformationen:", JSON.stringify(errorInfo, null, 2));
          
          return res.status(500).json(errorInfo);
        }
      } catch (error: unknown) {
        console.error("Fehler beim Erstellen des Posts:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ 
          message: `Der Post konnte nicht erstellt werden: ${errorMessage}`, 
          error: errorMessage,
          stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
        });
      }
    }
  );

  app.patch("/api/posts/:id", 
    // Multer-Middleware mit Fehlerbehandlung
    (req, res, next) => {
      upload.single("image")(req, res, (err) => {
        if (err) {
          console.error("Fehler beim Upload (Update):", err);
          if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
              return res.status(413).json({ 
                message: "Datei ist zu groß. Maximale Größe ist 5MB." 
              });
            }
            return res.status(400).json({ 
              message: `Upload-Fehler: ${err.message}` 
            });
          }
          return res.status(400).json({ 
            message: err.message || "Fehler beim Hochladen der Datei" 
          });
        }
        next();
      });
    },
    async (req, res) => {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      try {
        const existingPost = await storage.getPost(Number(req.params.id));
        if (!existingPost) {
          return res.status(404).json({ message: "Post nicht gefunden" });
        }

        let imageUrl = existingPost.imageUrl;
        let imageData = existingPost.imageData;
        
        if (req.file) {
          // Konvertiere das Bild in einen Base64-String
          const fileBuffer = req.file.buffer;
          const fileType = req.file.mimetype;
          const base64Image = fileBuffer.toString('base64');
          imageData = `data:${fileType};base64,${base64Image}`;
          imageUrl = null; // Setze imageUrl auf null, da wir jetzt imageData verwenden
          console.log("Neues Bild als Base64 konvertiert für Post-Update");
          console.log("Bild-Metadaten:", {
            größe: fileBuffer.length,
            typ: fileType,
            base64Länge: base64Image.length,
            base64Vorschau: base64Image.substring(0, 50) + "..."
          });
        }

        // Parse boolean value from string
        const scheduledInLinkedIn = req.body.scheduledInLinkedIn === 'true';

        const post = await storage.updatePost(Number(req.params.id), {
          content: req.body.content,
          userId: req.user.id,
          scheduledDate: req.body.scheduledDate ? new Date(req.body.scheduledDate) : undefined,
          accountId: req.body.accountId ? Number(req.body.accountId) : undefined,
          imageUrl,
          imageData,
          visibility: req.body.visibility,
          postType: req.body.postType,
          articleUrl: req.body.articleUrl,
          scheduledInLinkedIn,
        });
        res.json(post);
      } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ message: "Failed to update post" });
      }
    }
  );

  app.patch("/api/posts/:id/approve", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const post = await storage.approvePost(Number(req.params.id));
      res.json(post);
    } catch (error) {
      console.error("Error approving post:", error);
      res.status(500).json({ message: "Failed to approve post" });
    }
  });

  app.patch("/api/posts/:id/unapprove", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const post = await storage.unapprovePost(Number(req.params.id));
      res.json(post);
    } catch (error) {
      console.error("Error unapproving post:", error);
      res.status(500).json({ message: "Failed to unapprove post" });
    }
  });

  app.delete("/api/posts/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      await storage.deletePost(Number(req.params.id));
      res.sendStatus(200);
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ message: "Failed to delete post" });
    }
  });

  // Post Kommentar Routen
  app.get("/api/posts/:id/comments", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const comments = await storage.getPostComments(Number(req.params.id));
      res.json(comments);
    } catch (error) {
      console.error("Error fetching post comments:", error);
      res.status(500).json({ message: "Failed to fetch post comments" });
    }
  });
  
  app.post("/api/posts/:id/comments", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const comment = await storage.createPostComment({
        content: req.body.content,
        postId: Number(req.params.id),
        userId: req.user.id,
      });
      res.json(comment);
    } catch (error) {
      console.error("Error creating post comment:", error);
      res.status(500).json({ message: "Failed to create post comment" });
    }
  });
  
  app.delete("/api/comments/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      await storage.deletePostComment(Number(req.params.id));
      res.sendStatus(200);
    } catch (error) {
      console.error("Error deleting post comment:", error);
      res.status(500).json({ message: "Failed to delete post comment" });
    }
  });

  // Newsletter routes
  app.get("/api/newsletters", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const newsletters = await storage.getNewsletters();
      res.json(newsletters);
    } catch (error) {
      console.error("Error fetching newsletters:", error);
      res.status(500).json({ message: "Failed to fetch newsletters" });
    }
  });

  app.post("/api/newsletters", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const parsed = insertNewsletterSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json(parsed.error);
      const newsletter = await storage.createNewsletter({ ...parsed.data, userId: req.user.id });
      res.json(newsletter);
    } catch (error) {
      console.error("Error creating newsletter:", error);
      res.status(500).json({ message: "Failed to create newsletter" });
    }
  });

  app.patch("/api/newsletters/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const newsletter = await storage.updateNewsletter(Number(req.params.id), {
        title: req.body.title,
        content: req.body.content,
      });
      res.json(newsletter);
    } catch (error) {
      console.error("Error updating newsletter:", error);
      res.status(500).json({ message: "Failed to update newsletter" });
    }
  });

  app.delete("/api/newsletters/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      await storage.deleteNewsletter(Number(req.params.id));
      res.sendStatus(200);
    } catch (error) {
      console.error("Error deleting newsletter:", error);
      res.status(500).json({ message: "Failed to delete newsletter" });
    }
  });

  // Social Media Account Routen
  app.get("/api/social-accounts", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const accounts = await storage.getSocialAccounts();
      res.json(accounts);
    } catch (error) {
      console.error("Error fetching social accounts:", error);
      res.status(500).json({ message: "Failed to fetch social accounts" });
    }
  });

  app.post("/api/social-accounts", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const parsed = insertSocialAccountSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json(parsed.error);
      const account = await storage.createSocialAccount({ ...parsed.data, userId: req.user.id });
      res.json(account);
    } catch (error) {
      console.error("Error creating social account:", error);
      res.status(500).json({ message: "Failed to create social account" });
    }
  });

  app.delete("/api/social-accounts/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      await storage.deleteSocialAccount(Number(req.params.id));
      res.sendStatus(200);
    } catch (error) {
      console.error("Error deleting social account:", error);
      res.status(500).json({ message: "Failed to delete social account" });
    }
  });

  // Backup routes
  app.post("/api/backups", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      // Erstelle einen Backup-Eintrag in der Datenbank
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
        fileSize: 0, // wird später aktualisiert
      });

      try {
        // Führe pg_dump aus
        const databaseUrl = process.env.DATABASE_URL;
        if (!databaseUrl) {
          throw new Error("DATABASE_URL ist nicht gesetzt");
        }

        await execAsync(`pg_dump "${databaseUrl}" > "${filePath}"`);

        // Aktualisiere die Dateigröße
        const stats = fs.statSync(filePath);
        await storage.updateBackupStatus(backup.id, "completed");

        res.json(backup);
      } catch (error) {
        console.error("Backup-Fehler:", error);
        await storage.updateBackupStatus(backup.id, "failed", error.message);
        res.status(500).json({ message: "Backup fehlgeschlagen", error: error.message });
      }
    } catch (error) {
      console.error("Error creating backup:", error);
      res.status(500).json({ message: "Failed to create backup" });
    }
  });

  app.get("/api/backups", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const backups = await storage.getBackups();
      res.json(backups);
    } catch (error) {
      console.error("Error fetching backups:", error);
      res.status(500).json({ message: "Failed to fetch backups" });
    }
  });

  // DB-Test-Route für einfaches Debugging
  app.get("/api/test-db", async (req, res) => {
    try {
      console.log("DbTest-Endpunkt aufgerufen...");
      
      // Einfache Abfrage ausführen
      const testResult = await executeDirectQuery('SELECT id, username FROM users LIMIT 1');
      const result = testResult.rows;
      
      // Antwort senden
      res.json({
        message: "Datenbankabfrage erfolgreich",
        user: result && result.length > 0 ? result[0] : null
      });
    } catch (error) {
      console.error("Fehler im DbTest-Endpunkt:", error);
      res.status(500).json({ 
        message: "Datenbankabfrage fehlgeschlagen",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // Erweiterte Test-Route für Posts, Todos und Newsletter
  app.get("/api/test-db-all", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Nicht authentifiziert" });
    
    try {
      console.log("Erweiterte DB-Test-Route aufgerufen");
      const userId = (req.user as any).id;
      const results = {
        todo: null,
        post: null,
        newsletter: null,
        socialAccount: null,
        errors: {}
      };
      
      // Test für Todo-Erstellung
      try {
        const testTodo = await storage.createTodo({
          title: "Test Todo " + new Date().toISOString(),
          userId,
          description: "Automatisch erstellter Test-Todo",
          subtasks: ["Test Subtask 1", "Test Subtask 2"]
        });
        console.log("Test-Todo erstellt:", testTodo.id);
        results.todo = testTodo;
      } catch (error) {
        console.error("Fehler beim Erstellen eines Test-Todos:", error);
        results.errors.todo = error instanceof Error ? error.message : String(error);
      }
      
      // Test für Social-Account (wird für Posts benötigt)
      try {
        const accounts = await storage.getSocialAccounts();
        let testAccountId;
        
        if (accounts && accounts.length > 0) {
          testAccountId = accounts[0].id;
          results.socialAccount = accounts[0];
        } else {
          // Erstelle einen Test-Social-Account, wenn keiner existiert
          const testAccount = await storage.createSocialAccount({
            platform: "Test Platform",
            accountName: "Test Account",
            userId
          });
          testAccountId = testAccount.id;
          results.socialAccount = testAccount;
        }
        
        // Test für Post-Erstellung
        try {
          const testPost = await storage.createPost({
            content: "Test Post " + new Date().toISOString(),
            scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Morgen
            userId,
            accountId: testAccountId,
            imageUrl: "/uploads/test-image.jpg" // Beispielbild-URL
          });
          console.log("Test-Post erstellt:", testPost.id);
          results.post = testPost;
        } catch (error) {
          console.error("Fehler beim Erstellen eines Test-Posts:", error);
          results.errors.post = error instanceof Error ? error.message : String(error);
        }
      } catch (error) {
        console.error("Fehler beim Abrufen/Erstellen eines Social-Accounts:", error);
        results.errors.socialAccount = error instanceof Error ? error.message : String(error);
      }
      
      // Test für Newsletter-Erstellung
      try {
        const testNewsletter = await storage.createNewsletter({
          title: "Test Newsletter " + new Date().toISOString(),
          content: "Das ist ein automatisch erstellter Test-Newsletter.",
          userId
        });
        console.log("Test-Newsletter erstellt:", testNewsletter.id);
        results.newsletter = testNewsletter;
      } catch (error) {
        console.error("Fehler beim Erstellen eines Test-Newsletters:", error);
        results.errors.newsletter = error instanceof Error ? error.message : String(error);
      }
      
      // Gesamtergebnis zurückgeben
      return res.json({
        success: true,
        message: "Datenbank-Tests abgeschlossen",
        results,
        hasErrors: Object.keys(results.errors).length > 0
      });
    } catch (error) {
      console.error("Fehler bei erweiterten DB-Tests:", error);
      return res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}