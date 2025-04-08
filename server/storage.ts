import { InsertUser, User, Todo, Post, Newsletter, users, todos, posts, newsletters, socialAccounts, postAccounts, postAnalytics, type SocialAccount, type InsertSocialAccount, subtasks, SubTask, backups, Backup, InsertBackup, postComments, PostComment, InsertPostComment } from "./shared/schema-basic.js";
import { db } from "./db.js";
import { eq, asc, isNotNull, isNull, desc, and, or, sql, gt, gte, lt, lte, inArray } from "drizzle-orm";
import session from "express-session";
import memorystore from 'memorystore';
import { pool } from "./db.js";

// Session-Store Konfiguration
let sessionStore: session.Store;

// Verwende immer MemoryStore, um Berechtigungsprobleme mit der user_sessions Tabelle zu vermeiden
console.log("Verwende Memory Session-Store");
const MemoryStore = memorystore(session);
sessionStore = new MemoryStore({
  checkPeriod: 86400000 // Bereinige abgelaufene Einträge alle 24h
});
console.log("Memory Session-Store initialisiert");

// MOCK-Daten werden nicht mehr benötigt
// const MOCK_SOCIAL_ACCOUNTS = [
//   { id: 1, name: "LinkedIn", userId: 1, url: "https://linkedin.com/in/example", username: "example_user" },
//   { id: 2, name: "LinkedIn", userId: 1, url: "https://linkedin.com/in/example2", username: "example_user2" }
// ];

// const MOCK_POSTS = [
//   { id: 1, userId: 1, accountId: 1, content: "Demo Post 1", scheduledDate: new Date().toISOString(), status: "draft" },
//   { id: 2, userId: 1, accountId: 2, content: "Demo Post 2", scheduledDate: new Date().toISOString(), status: "scheduled" }
// ];

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsers(): Promise<User[]>;

  // Todo operations
  getTodos(): Promise<(Todo & { subtasks: SubTask[]; assignedTo?: User })[]>;
  createTodo(todo: { 
    title: string; 
    userId: number; 
    description?: string; 
    deadline?: Date; 
    subtasks?: string[];
    assignedToUserId?: number;
  }): Promise<Todo>;
  updateTodo(id: number, data: { 
    completed?: boolean; 
    deadline?: Date;
    assignedToUserId?: number;
  }): Promise<Todo>;
  deleteTodo(id: number): Promise<void>;

  // Post operations
  getPosts(): Promise<(Post & { account: SocialAccount; lastEditedBy?: User })[]>;
  getPost(id: number): Promise<Post | undefined>;
  createPost(post: { 
    content: string; 
    scheduledDate: Date; 
    userId: number; 
    accountId: number; 
    imageUrl?: string;
    imageData?: string;
  }): Promise<Post>;
  updatePost(id: number, data: {
    content: string;
    userId: number;
    scheduledDate?: Date;
    accountId?: number;
    imageUrl?: string | null;
    imageData?: string | null;
    platformPostId?: string;
    publishStatus?: string;
    visibility?: string;
    postType?: string;
    articleUrl?: string;
    scheduledInLinkedIn?: boolean;
  }): Promise<Post>;
  approvePost(id: number): Promise<Post>;
  unapprovePost(id: number): Promise<Post>;
  deletePost(id: number): Promise<void>;
  restorePost(id: number): Promise<Post>;
  getDeletedPosts(): Promise<(Post & { account: SocialAccount; lastEditedBy?: User })[]>;

  // Newsletter operations
  getNewsletters(): Promise<Newsletter[]>;
  createNewsletter(newsletter: { title: string; content: string; userId: number }): Promise<Newsletter>;
  updateNewsletter(id: number, data: { title: string; content: string }): Promise<Newsletter>;
  deleteNewsletter(id: number): Promise<void>;

  // Social Media Account Operationen
  getSocialAccounts(): Promise<SocialAccount[]>;
  getSocialAccount(id: number): Promise<SocialAccount | undefined>;
  getSocialAccountByPlatformId(platformId: string, platform: string): Promise<SocialAccount | undefined>;
  createSocialAccount(account: InsertSocialAccount & {
    userId: number;
    accessToken?: string;
    refreshToken?: string;
    tokenExpiresAt?: Date;
    platformUserId?: string;
    platformPageId?: string;
  }): Promise<SocialAccount>;
  updateSocialAccount(id: number, data: {
    accessToken?: string;
    refreshToken?: string;
    tokenExpiresAt?: Date;
  }): Promise<SocialAccount>;
  deleteSocialAccount(id: number): Promise<void>;

  // Analytics operations
  updatePostAnalytics(postId: number, data: {
    impressions: number;
    clicks: number;
    likes: number;
    shares: number;
    comments: number;
    engagementRate: number;
    demographicData: any;
    updatedAt: Date;
  }): Promise<void>;

  // Neue Subtask-Operationen
  createSubtask(subtask: { title: string; todoId: number }): Promise<SubTask>;
  updateSubtask(id: number, completed: boolean): Promise<SubTask>;
  deleteSubtask(id: number): Promise<void>;

  // Neue Backup-Funktionen
  createBackup(backup: InsertBackup): Promise<Backup>;
  updateBackupStatus(id: number, status: string, error?: string): Promise<Backup>;
  getBackups(): Promise<Backup[]>;
  getLatestBackup(): Promise<Backup | undefined>;

  // Post comment operations
  getPostComments(postId: number): Promise<(PostComment & { user: User })[]>;
  createPostComment(comment: { content: string; postId: number; userId: number }): Promise<PostComment>;
  deletePostComment(id: number): Promise<void>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = sessionStore;
  }

  async getUsers(): Promise<User[]> {
    if (!db) throw new Error('Datenbank nicht initialisiert');
    return db.select().from(users);
  }

  async getUser(id: number): Promise<User | undefined> {
    if (!db) throw new Error('Datenbank nicht initialisiert');
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    if (!db) throw new Error('Datenbank nicht initialisiert');
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    if (!db) throw new Error('Datenbank nicht initialisiert');
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getTodos(): Promise<(Todo & { subtasks: SubTask[]; assignedTo?: User })[]> {
    if (!db) throw new Error('Datenbank nicht initialisiert');
    const result = await db
      .select({
        todo: todos,
        subtask: subtasks,
        assignedTo: users,
      })
      .from(todos)
      .leftJoin(subtasks, eq(todos.id, subtasks.todoId))
      .leftJoin(users, eq(todos.assignedToUserId, users.id));

    const todosMap = new Map<number, Todo & { subtasks: SubTask[]; assignedTo?: User }>();

    for (const row of result) {
      if (!todosMap.has(row.todo.id)) {
        todosMap.set(row.todo.id, {
          ...row.todo,
          subtasks: [],
          assignedTo: row.assignedTo || undefined,
        });
      }

      if (row.subtask) {
        todosMap.get(row.todo.id)!.subtasks.push(row.subtask);
      }
    }

    return Array.from(todosMap.values());
  }

  async createTodo(todo: { 
    title: string; 
    userId: number; 
    description?: string; 
    deadline?: Date;
    subtasks?: string[];
    assignedToUserId?: number;
  }): Promise<Todo> {
    if (!db) throw new Error('Datenbank nicht initialisiert');
    const { subtasks: subtaskTitles, ...todoData } = todo;
    const [newTodo] = await db.insert(todos).values(todoData).returning();

    if (subtaskTitles?.length) {
      await Promise.all(
        subtaskTitles.map(title =>
          db!.insert(subtasks).values({
            title,
            todoId: newTodo.id,
            completed: false,
          })
        )
      );
    }

    return newTodo;
  }

  async updateTodo(id: number, data: { 
    completed?: boolean; 
    deadline?: Date;
    assignedToUserId?: number;
  }): Promise<Todo> {
    if (!db) throw new Error('Datenbank nicht initialisiert');
    const [todo] = await db
      .update(todos)
      .set(data)
      .where(eq(todos.id, id))
      .returning();
    return todo;
  }

  async deleteTodo(id: number): Promise<void> {
    if (!db) throw new Error('Datenbank nicht initialisiert');
    await db.delete(todos).where(eq(todos.id, id));
  }

  async getPosts(): Promise<(Post & { account: SocialAccount; lastEditedBy?: User })[]> {
    if (!db) throw new Error('Datenbank nicht initialisiert');
    
    const result = await db
      .select({
        id: posts.id,
        userId: posts.userId,
        content: posts.content,
        imageUrl: posts.imageUrl,
        scheduledDate: posts.scheduledDate,
        approved: posts.approved,
        accountId: posts.accountId,
        lastEditedAt: posts.lastEditedAt,
        lastEditedByUserId: posts.lastEditedByUserId,
        platformPostId: posts.platformPostId,
        visibility: posts.visibility,
        articleUrl: posts.articleUrl,
        postType: posts.postType,
        publishStatus: posts.publishStatus,
        failureReason: posts.failureReason,
        deletedAt: posts.deletedAt,
        scheduledInLinkedIn: posts.scheduledInLinkedIn,
        account: {
          id: socialAccounts.id,
          platform: socialAccounts.platform,
          accountName: socialAccounts.accountName,
          userId: socialAccounts.userId,
          accessToken: socialAccounts.accessToken,
          refreshToken: socialAccounts.refreshToken,
          tokenExpiresAt: socialAccounts.tokenExpiresAt,
          platformUserId: socialAccounts.platformUserId,
          platformPageId: socialAccounts.platformPageId
        },
        lastEditedBy: {
          id: users.id,
          username: users.username,
          password: users.password
        }
      })
      .from(posts)
      .leftJoin(socialAccounts, eq(posts.accountId, socialAccounts.id))
      .leftJoin(users, eq(posts.lastEditedByUserId, users.id))
      .where(isNull(posts.deletedAt))
      .orderBy(asc(posts.scheduledDate));
      
    // Wir müssen den Typ explizit umwandeln, um Typkonflikte zu vermeiden
    return result.map(post => {
      // Wenn lastEditedBy null ist, setzen wir es auf undefined
      const lastEditedBy = post.lastEditedBy && post.lastEditedBy.id ? post.lastEditedBy : undefined;
      // Wenn account null ist, erzeugen wir ein leeres SocialAccount-Objekt
      const account = post.account || {
        id: 0,
        platform: "",
        accountName: "",
        userId: 0,
        accessToken: null,
        refreshToken: null,
        tokenExpiresAt: null,
        platformUserId: null,
        platformPageId: null
      };
      
      return {
        ...post,
        account,
        lastEditedBy
      } as (Post & { account: SocialAccount; lastEditedBy?: User });
    });
  }

  async getPost(id: number): Promise<Post | undefined> {
    if (!db) throw new Error('Datenbank nicht initialisiert');
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    
    if (post) {
      // Lade Kommentare für diesen Post
      const comments = await this.getPostComments(post.id);
      return { ...post, comments };
    }
    
    return post;
  }

  async createPost(post: { 
    content: string; 
    scheduledDate: Date; 
    userId: number; 
    accountId: number; 
    imageUrl?: string;
    imageData?: string;
  }): Promise<Post> {
    if (!db) throw new Error('Datenbank nicht initialisiert');
    
    try {
      // Prüfe, ob image_data in der Datenbank existiert, bevor wir versuchen, dorthin zu schreiben
      const hasImageData = await this.checkIfColumnExists('posts', 'image_data');
      console.log(`image_data Spalte existiert: ${hasImageData}`);
      
      // Erstelle ein sicheres Einfügedaten-Objekt
      const insertData: any = {
        content: post.content,
        scheduledDate: post.scheduledDate,
        userId: post.userId,
        accountId: post.accountId,
        lastEditedAt: new Date(),
        lastEditedByUserId: post.userId,
        publishStatus: 'draft', // Standard-Status für neue Posts
      };
      
      // Bild verarbeiten
      let imageDataLogged = false;
      
      // Füge imageUrl hinzu, wenn es vorhanden ist
      if (post.imageUrl) {
        insertData.imageUrl = post.imageUrl;
        console.log("Speichere Post mit imageUrl:", post.imageUrl);
      }
      
      // Füge imageData nur hinzu, wenn die Spalte existiert und Daten vorhanden sind
      if (hasImageData && post.imageData) {
        insertData.imageData = post.imageData;
        console.log("Füge imageData zum Post hinzu, Länge:", post.imageData.length);
        console.log("Bildtyp:", post.imageData.substring(0, 30) + "...");
        imageDataLogged = true;
      } else if (post.imageData) {
        // Wenn imageData bereitgestellt wurde, aber die Spalte nicht existiert
        console.warn('image_data Spalte existiert nicht in der Datenbank, Bild kann nicht als Base64 gespeichert werden');
        // Versuche, es als URL zu speichern falls möglich
        if (!post.imageUrl && post.imageData.startsWith('data:')) {
          console.log("Konvertiere Base64-Bild in URL, da image_data nicht verfügbar ist");
          // Hier könnten Sie theoretisch das Bild auf einen externen Speicher hochladen
          // Für diesen Fall lassen wir es einfach
          console.warn("Bild kann nicht gespeichert werden, da image_data nicht verfügbar ist und keine URL-Konvertierung implementiert ist");
        }
      }
      
      // Führe den Insert aus
      console.log("Führe Post-Insert mit folgenden Daten aus:", Object.keys(insertData).join(", "));
      const [newPost] = await db.insert(posts).values(insertData).returning();
      
      // Vollständige Antwort protokollieren
      console.log("Neuer Post erstellt:", {
        id: newPost.id,
        content: newPost.content.substring(0, 20) + "...",
        hasImageUrl: !!newPost.imageUrl,
        hasImageData: !!newPost.imageData,
        scheduledDate: newPost.scheduledDate,
        fields: Object.keys(newPost)
      });
      
      // Überprüfe, ob Bilddaten korrekt gespeichert wurden
      if ((post.imageUrl || post.imageData) && !newPost.imageUrl && !newPost.imageData) {
        console.warn("WARNUNG: Bild wurde möglicherweise nicht korrekt gespeichert!");
        console.warn("Eingabedaten enthielten Bild, aber gespeicherter Post hat keine Bilddaten");
      }
      
      return newPost;
    } catch (error) {
      console.error('Fehler beim Erstellen des Posts:', error);
      throw error;
    }
  }

  // Hilfsmethode, um zu prüfen, ob eine Spalte in einer Tabelle existiert
  private async checkIfColumnExists(tableName: string, columnName: string): Promise<boolean> {
    if (!pool) return true; // In SQLite-Modus immer true zurückgeben
    
    try {
      const query = `
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = $1 AND column_name = $2
      `;
      console.log(`Prüfe, ob Spalte ${columnName} in Tabelle ${tableName} existiert mit Abfrage: ${query}`);
      
      const result = await pool.query(query, [tableName, columnName]);
      
      console.log(`Ergebnis der Spaltenprüfung für ${tableName}.${columnName}:`, JSON.stringify(result.rows), `Spalte existiert: ${result.rows.length > 0}`);
      
      return result.rows.length > 0;
    } catch (error) {
      console.error(`Fehler beim Prüfen, ob Spalte ${columnName} in Tabelle ${tableName} existiert:`, error);
      return false; // Im Fehlerfall False zurückgeben, um auf Nummer sicher zu gehen
    }
  }

  async updatePost(id: number, data: {
    content: string;
    userId: number;
    scheduledDate?: Date;
    accountId?: number;
    imageUrl?: string | null;
    imageData?: string | null;
    platformPostId?: string;
    publishStatus?: string;
    visibility?: string;
    postType?: string;
    articleUrl?: string;
    scheduledInLinkedIn?: boolean;
  }): Promise<Post> {
    if (!db) throw new Error('Datenbank nicht initialisiert');
    
    try {
      // Prüfe, ob image_data in der Datenbank existiert
      const hasImageData = await this.checkIfColumnExists('posts', 'image_data');
      
      // Hole zuerst den existierenden Post, um vorhandene Bildwerte zu prüfen
      const [existingPost] = await db.select().from(posts).where(eq(posts.id, id));
      
      // Konvertiere null zu undefined für TypeScript-Kompatibilität
      const updateData: any = {
        ...data,
        lastEditedAt: new Date(),
        lastEditedByUserId: data.userId
      };
      
      // Behandle imageUrl und imageData nur, wenn sie explizit gesetzt wurden
      // Wenn sie nicht im Anfrageobjekt enthalten sind oder undefined sind, behalte die bestehenden Werte bei
      if (data.imageUrl === null) {
        // Nur setzen, wenn explizit null gesetzt wurde (Bild löschen)
        updateData.imageUrl = undefined;
      } else if (data.imageUrl === undefined) {
        // Wenn nicht in den Daten, behalte die bestehenden Werte bei
        delete updateData.imageUrl;
      }
      
      if (data.imageData === null) {
        // Nur setzen, wenn explizit null gesetzt wurde (Bild löschen)
        updateData.imageData = undefined;
      } else if (data.imageData === undefined) {
        // Wenn nicht in den Daten, behalte die bestehenden Werte bei
        delete updateData.imageData;
      }
      
      // Entferne imageData aus den Update-Daten, wenn die Spalte nicht existiert
      if (!hasImageData && 'imageData' in updateData) {
        console.warn('image_data Spalte existiert nicht in der Datenbank, Bild kann nicht als Base64 aktualisiert werden');
        delete updateData.imageData;
      }
      
      console.log("Aktualisiere Post mit folgenden Feldern:", Object.keys(updateData).join(", "));
      const [updatedPost] = await db.update(posts)
        .set(updateData)
        .where(eq(posts.id, id))
        .returning();
      
      return updatedPost;
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Posts:', error);
      throw error;
    }
  }

  async approvePost(id: number): Promise<Post> {
    if (!db) throw new Error('Datenbank nicht initialisiert');
    const [post] = await db
      .update(posts)
      .set({ approved: true })
      .where(eq(posts.id, id))
      .returning();
    return post;
  }

  async unapprovePost(id: number): Promise<Post> {
    if (!db) throw new Error('Datenbank nicht initialisiert');
    const [post] = await db
      .update(posts)
      .set({ approved: false })
      .where(eq(posts.id, id))
      .returning();
    return post;
  }

  async deletePost(id: number): Promise<void> {
    if (!db) throw new Error('Datenbank nicht initialisiert');
    await db
      .update(posts)
      .set({ 
        deletedAt: new Date(),
        publishStatus: 'deleted'
      })
      .where(eq(posts.id, id));
  }

  async restorePost(id: number): Promise<Post> {
    if (!db) throw new Error('Datenbank nicht initialisiert');
    const [post] = await db
      .update(posts)
      .set({ 
        deletedAt: null,
        publishStatus: 'draft'
      })
      .where(eq(posts.id, id))
      .returning();
    return post;
  }

  async getDeletedPosts(): Promise<(Post & { account: SocialAccount; lastEditedBy?: User })[]> {
    if (!db) throw new Error('Datenbank nicht initialisiert');
    const result = await db.select({
      post: posts,
      account: socialAccounts,
      lastEditedBy: users,
    })
      .from(posts)
      .leftJoin(socialAccounts, eq(posts.accountId, socialAccounts.id))
      .leftJoin(users, eq(posts.lastEditedByUserId, users.id))
      .where(isNotNull(posts.deletedAt))
      .orderBy(asc(posts.scheduledDate));

    return result.map(({ post, account, lastEditedBy }) => ({
      ...post,
      account: account!,
      lastEditedBy: lastEditedBy || undefined,
    }));
  }

  async getNewsletters(): Promise<Newsletter[]> {
    if (!db) throw new Error('Datenbank nicht initialisiert');
    return db.select().from(newsletters);
  }

  async createNewsletter(newsletter: { title: string; content: string; userId: number }): Promise<Newsletter> {
    if (!db) throw new Error('Datenbank nicht initialisiert');
    const [newNewsletter] = await db.insert(newsletters).values(newsletter).returning();
    return newNewsletter;
  }

  async updateNewsletter(id: number, data: { title: string; content: string }): Promise<Newsletter> {
    if (!db) throw new Error('Datenbank nicht initialisiert');
    const [newsletter] = await db
      .update(newsletters)
      .set(data)
      .where(eq(newsletters.id, id))
      .returning();
    return newsletter;
  }

  async deleteNewsletter(id: number): Promise<void> {
    if (!db) throw new Error('Datenbank nicht initialisiert');
    await db.delete(newsletters).where(eq(newsletters.id, id));
  }

  async getSocialAccounts(): Promise<SocialAccount[]> {
    if (!db) throw new Error('Datenbank nicht initialisiert');
    return db.select().from(socialAccounts);
  }

  async getSocialAccount(id: number): Promise<SocialAccount | undefined> {
    if (!db) throw new Error('Datenbank nicht initialisiert');
    const [account] = await db
      .select()
      .from(socialAccounts)
      .where(eq(socialAccounts.id, id));
    return account;
  }

  async getSocialAccountByPlatformId(platformId: string, platform: string): Promise<SocialAccount | undefined> {
    if (!db) throw new Error('Datenbank nicht initialisiert');
    const [account] = await db.select().from(socialAccounts).where(and(
      eq(socialAccounts.platformUserId, platformId),
      eq(socialAccounts.platform, platform)
    ));
    return account;
  }

  async createSocialAccount(account: InsertSocialAccount & {
    userId: number;
    accessToken?: string;
    refreshToken?: string;
    tokenExpiresAt?: Date;
    platformUserId?: string;
    platformPageId?: string;
  }): Promise<SocialAccount> {
    if (!db) throw new Error('Datenbank nicht initialisiert');
    const [newAccount] = await db.insert(socialAccounts).values(account).returning();
    return newAccount;
  }

  async updateSocialAccount(id: number, data: {
    accessToken?: string;
    refreshToken?: string;
    tokenExpiresAt?: Date;
  }): Promise<SocialAccount> {
    if (!db) throw new Error('Datenbank nicht initialisiert');
    const [updatedAccount] = await db.update(socialAccounts).set(data).where(eq(socialAccounts.id, id)).returning();
    return updatedAccount;
  }

  async deleteSocialAccount(id: number): Promise<void> {
    if (!db) throw new Error('Datenbank nicht initialisiert');
    await db.delete(socialAccounts).where(eq(socialAccounts.id, id));
  }

  async updatePostAnalytics(postId: number, data: {
    impressions: number;
    clicks: number;
    likes: number;
    shares: number;
    comments: number;
    engagementRate: number;
    demographicData: any;
    updatedAt: Date;
  }): Promise<void> {
    if (!db) throw new Error('Datenbank nicht initialisiert');
    // Prüfe, ob bereits Analytics für diesen Post existieren
    const existing = await db.select().from(postAnalytics).where(eq(postAnalytics.postId, postId));

    if (existing.length === 0) {
      // Erstelle neuen Analytics-Eintrag
      await db.insert(postAnalytics).values({
        postId,
        ...data
      });
    } else {
      // Aktualisiere bestehenden Eintrag
      await db.update(postAnalytics)
        .set(data)
        .where(eq(postAnalytics.postId, postId));
    }
  }

  async createSubtask(subtask: { title: string; todoId: number }): Promise<SubTask> {
    if (!db) throw new Error('Datenbank nicht initialisiert');
    const [newSubtask] = await db.insert(subtasks).values({
      ...subtask,
      completed: false
    }).returning();
    return newSubtask;
  }

  async updateSubtask(id: number, completed: boolean): Promise<SubTask> {
    if (!db) throw new Error('Datenbank nicht initialisiert');
    const [updatedSubtask] = await db.update(subtasks)
      .set({ completed })
      .where(eq(subtasks.id, id))
      .returning();
    return updatedSubtask;
  }

  async deleteSubtask(id: number): Promise<void> {
    if (!db) throw new Error('Datenbank nicht initialisiert');
    await db.delete(subtasks).where(eq(subtasks.id, id));
  }

  async createBackup(backup: InsertBackup): Promise<Backup> {
    if (!db) throw new Error('Datenbank nicht initialisiert');
    const [newBackup] = await db.insert(backups).values(backup).returning();
    return newBackup;
  }

  async updateBackupStatus(id: number, status: string, error?: string): Promise<Backup> {
    if (!db) throw new Error('Datenbank nicht initialisiert');
    const data: any = { status };
    
    if (status === 'completed') {
      data.completedAt = new Date();
    }
    
    if (error) {
      data.error = error;
    }
    
    const [updatedBackup] = await db.update(backups)
      .set(data)
      .where(eq(backups.id, id))
      .returning();
    return updatedBackup;
  }

  async getBackups(): Promise<Backup[]> {
    if (!db) throw new Error('Datenbank nicht initialisiert');
    return db.select().from(backups).orderBy(desc(backups.createdAt));
  }

  async getLatestBackup(): Promise<Backup | undefined> {
    if (!db) throw new Error('Datenbank nicht initialisiert');
    const [backup] = await db.select().from(backups)
      .where(eq(backups.status, 'completed'))
      .orderBy(desc(backups.createdAt))
      .limit(1);
    return backup;
  }

  // Implementierung der Kommentar-Funktionen
  async getPostComments(postId: number): Promise<(PostComment & { user: User })[]> {
    if (!db) throw new Error('Datenbank nicht initialisiert');
    
    const result = await db
      .select({
        id: postComments.id,
        content: postComments.content,
        postId: postComments.postId,
        userId: postComments.userId,
        createdAt: postComments.createdAt,
        user: {
          id: users.id,
          username: users.username,
          password: users.password
        }
      })
      .from(postComments)
      .innerJoin(users, eq(postComments.userId, users.id))
      .where(eq(postComments.postId, postId))
      .orderBy(asc(postComments.createdAt));
    
    return result as (PostComment & { user: User })[];
  }

  async createPostComment(comment: { content: string; postId: number; userId: number }): Promise<PostComment> {
    if (!db) throw new Error('Datenbank nicht initialisiert');
    const [newComment] = await db.insert(postComments).values({
      ...comment,
      createdAt: new Date()
    }).returning();
    return newComment;
  }

  async deletePostComment(id: number): Promise<void> {
    if (!db) throw new Error('Datenbank nicht initialisiert');
    await db.delete(postComments).where(eq(postComments.id, id));
  }
}

export const storage = new DatabaseStorage();