import { InsertUser, User, Todo, Post, Newsletter, users, todos, posts, newsletters, socialAccounts, postAccounts, postAnalytics, type SocialAccount, type InsertSocialAccount } from "@shared/schema";
import { db } from "./db";
import { eq, asc } from "drizzle-orm";
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
  getPosts(): Promise<(Post & { account: SocialAccount; lastEditedBy?: User })[]>;
  getPost(id: number): Promise<Post | undefined>;
  createPost(post: { content: string; scheduledDate: Date; userId: number; accountId: number; imageUrl?: string }): Promise<Post>;
  updatePost(id: number, data: {
    content: string;
    userId: number;
    scheduledDate?: Date;
    accountId?: number;
    imageUrl?: string;
    platformPostId?: string;
    publishStatus?: string;
    visibility?: string;
    postType?: string;
    articleUrl?: string;
  }): Promise<Post>;
  approvePost(id: number): Promise<Post>;
  unapprovePost(id: number): Promise<Post>;
  deletePost(id: number): Promise<void>;

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

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      tableName: "user_sessions",
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

  async getPosts(): Promise<(Post & { account: SocialAccount; lastEditedBy?: User })[]> {
    const result = await db.select({
      post: posts,
      account: socialAccounts,
      lastEditedBy: users,
    })
      .from(posts)
      .leftJoin(socialAccounts, eq(posts.accountId, socialAccounts.id))
      .leftJoin(users, eq(posts.lastEditedByUserId, users.id))
      .orderBy(asc(posts.scheduledDate));

    return result.map(({ post, account, lastEditedBy }) => ({
      ...post,
      account: account!,
      lastEditedBy,
    }));
  }

  async createPost(post: { content: string; scheduledDate: Date; userId: number; accountId: number; imageUrl?: string }): Promise<Post> {
    const [newPost] = await db.insert(posts).values(post).returning();
    return newPost;
  }

  async updatePost(id: number, data: {
    content: string;
    userId: number;
    scheduledDate?: Date;
    accountId?: number;
    imageUrl?: string;
    platformPostId?: string;
    publishStatus?: string;
    visibility?: string;
    postType?: string;
    articleUrl?: string;
  }): Promise<Post> {
    const [post] = await db
      .update(posts)
      .set({
        content: data.content,
        lastEditedAt: new Date(),
        lastEditedByUserId: data.userId,
        ...(data.scheduledDate && { scheduledDate: data.scheduledDate }),
        ...(data.accountId && { accountId: data.accountId }),
        ...(data.imageUrl && { imageUrl: data.imageUrl }),
        ...(data.platformPostId && { platformPostId: data.platformPostId }),
        ...(data.publishStatus && { publishStatus: data.publishStatus }),
        ...(data.visibility && { visibility: data.visibility }),
        ...(data.postType && { postType: data.postType }),
        ...(data.articleUrl && { articleUrl: data.articleUrl }),
      })
      .where(eq(posts.id, id))
      .returning();
    return post;
  }

  async approvePost(id: number): Promise<Post> {
    const [post] = await db
      .update(posts)
      .set({ approved: true })
      .where(eq(posts.id, id))
      .returning();
    return post;
  }

  async unapprovePost(id: number): Promise<Post> {
    const [post] = await db
      .update(posts)
      .set({ approved: false })
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

  async updateNewsletter(id: number, data: { title: string; content: string }): Promise<Newsletter> {
    const [newsletter] = await db
      .update(newsletters)
      .set(data)
      .where(eq(newsletters.id, id))
      .returning();
    return newsletter;
  }

  async deleteNewsletter(id: number): Promise<void> {
    await db.delete(newsletters).where(eq(newsletters.id, id));
  }

  async getSocialAccounts(): Promise<SocialAccount[]> {
    return db.select().from(socialAccounts);
  }

  async getSocialAccount(id: number): Promise<SocialAccount | undefined> {
    const [account] = await db
      .select()
      .from(socialAccounts)
      .where(eq(socialAccounts.id, id));
    return account;
  }

  async getSocialAccountByPlatformId(platformId: string, platform: string): Promise<SocialAccount | undefined> {
    const [account] = await db
      .select()
      .from(socialAccounts)
      .where(eq(socialAccounts.platformUserId, platformId))
      .where(eq(socialAccounts.platform, platform));
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
    const [newAccount] = await db.insert(socialAccounts).values(account).returning();
    return newAccount;
  }

  async updateSocialAccount(id: number, data: {
    accessToken?: string;
    refreshToken?: string;
    tokenExpiresAt?: Date;
  }): Promise<SocialAccount> {
    const [account] = await db
      .update(socialAccounts)
      .set(data)
      .where(eq(socialAccounts.id, id))
      .returning();
    return account;
  }

  async deleteSocialAccount(id: number): Promise<void> {
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
    await db
      .insert(postAnalytics)
      .values({ postId, ...data })
      .onConflictDoUpdate({
        target: [postAnalytics.postId],
        set: data,
      });
  }

  async getPost(id: number): Promise<Post | undefined> {
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, id));
    return post;
  }
}

export const storage = new DatabaseStorage();