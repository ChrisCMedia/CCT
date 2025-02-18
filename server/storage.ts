import { InsertUser, User, Todo, Post, Newsletter, users, todos, posts, newsletters, socialAccounts, postAccounts, type SocialAccount, type InsertSocialAccount } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Todo operations
  getTodos(): Promise<Todo[]>;
  createTodo(todo: { title: string; userId: number }): Promise<Todo>;
  updateTodo(id: number, completed: boolean): Promise<Todo>;
  deleteTodo(id: number): Promise<void>;

  // Post operations
  getPosts(): Promise<Post[]>;
  createPost(post: { content: string; scheduledDate: Date; userId: number; accountIds: number[] }): Promise<Post>;
  approvePost(id: number): Promise<Post>;
  deletePost(id: number): Promise<void>;

  // Newsletter operations
  getNewsletters(): Promise<Newsletter[]>;
  createNewsletter(newsletter: { title: string; content: string; userId: number }): Promise<Newsletter>;

  // Neue Social Media Account Operationen
  getSocialAccounts(): Promise<SocialAccount[]>;
  createSocialAccount(account: InsertSocialAccount & { userId: number }): Promise<SocialAccount>;
  deleteSocialAccount(id: number): Promise<void>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      tableName: 'user_sessions',
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getTodos(): Promise<Todo[]> {
    return db.select().from(todos);
  }

  async createTodo(todo: { title: string; userId: number }): Promise<Todo> {
    const [newTodo] = await db.insert(todos).values(todo).returning();
    return newTodo;
  }

  async updateTodo(id: number, completed: boolean): Promise<Todo> {
    const [todo] = await db
      .update(todos)
      .set({ completed })
      .where(eq(todos.id, id))
      .returning();
    return todo;
  }

  async deleteTodo(id: number): Promise<void> {
    await db.delete(todos).where(eq(todos.id, id));
  }

  async getPosts(): Promise<Post[]> {
    return db.select().from(posts);
  }

  async createPost(post: { content: string; scheduledDate: Date; userId: number; accountIds: number[] }): Promise<Post> {
    const { accountIds, ...postData } = post;

    const [newPost] = await db.insert(posts).values(postData).returning();

    await Promise.all(
      accountIds.map((accountId) =>
        db.insert(postAccounts).values({
          postId: newPost.id,
          accountId,
        })
      )
    );

    return newPost;
  }

  async approvePost(id: number): Promise<Post> {
    const [post] = await db
      .update(posts)
      .set({ approved: true })
      .where(eq(posts.id, id))
      .returning();
    return post;
  }

  async deletePost(id: number): Promise<void> {
    await db.delete(posts).where(eq(posts.id, id));
  }

  async getNewsletters(): Promise<Newsletter[]> {
    return db.select().from(newsletters);
  }

  async createNewsletter(newsletter: { title: string; content: string; userId: number }): Promise<Newsletter> {
    const [newNewsletter] = await db.insert(newsletters).values(newsletter).returning();
    return newNewsletter;
  }

  async getSocialAccounts(): Promise<SocialAccount[]> {
    return db.select().from(socialAccounts);
  }

  async createSocialAccount(account: InsertSocialAccount & { userId: number }): Promise<SocialAccount> {
    const [newAccount] = await db.insert(socialAccounts).values(account).returning();
    return newAccount;
  }

  async deleteSocialAccount(id: number): Promise<void> {
    await db.delete(socialAccounts).where(eq(socialAccounts.id, id));
  }
}

export const storage = new DatabaseStorage();