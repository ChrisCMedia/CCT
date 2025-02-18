import { InsertUser, User, Todo, Post, Newsletter, users, todos, posts, newsletters, socialAccounts, postAccounts, postAnalytics, type SocialAccount, type InsertSocialAccount, subtasks, SubTask } from "@shared/schema";
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
  // Neue Subtask-Operationen
  createSubtask(subtask: { title: string; todoId: number }): Promise<SubTask>;
  updateSubtask(id: number, completed: boolean): Promise<SubTask>;
  deleteSubtask(id: number): Promise<void>;
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

  async getUsers(): Promise<User[]> {
    return db.select().from(users);
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

  async getTodos(): Promise<(Todo & { subtasks: SubTask[]; assignedTo?: User })[]> {
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
    const { subtasks: subtaskTitles, ...todoData } = todo;
    const [newTodo] = await db.insert(todos).values(todoData).returning();

    if (subtaskTitles?.length) {
      await db.insert(subtasks).values(
        subtaskTitles.map(title => ({
          title,
          todoId: newTodo.id,
        }))
      );
    }

    return newTodo;
  }

  async updateTodo(id: number, data: { 
    completed?: boolean; 
    deadline?: Date;
    assignedToUserId?: number;
  }): Promise<Todo> {
    const [todo] = await db
      .update(todos)
      .set(data)
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
        scheduledDate: data.scheduledDate || undefined,
        accountId: data.accountId || undefined,
        imageUrl: data.imageUrl || undefined,
        platformPostId: data.platformPostId || undefined,
        publishStatus: data.publishStatus || undefined,
        visibility: data.visibility || undefined,
        postType: data.postType || undefined,
        articleUrl: data.articleUrl || undefined,
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

  async createSubtask(subtask: { title: string; todoId: number }): Promise<SubTask> {
    const [newSubtask] = await db.insert(subtasks).values(subtask).returning();
    return newSubtask;
  }

  async updateSubtask(id: number, completed: boolean): Promise<SubTask> {
    const [subtask] = await db
      .update(subtasks)
      .set({ completed })
      .where(eq(subtasks.id, id))
      .returning();
    return subtask;
  }

  async deleteSubtask(id: number): Promise<void> {
    await db.delete(subtasks).where(eq(subtasks.id, id));
  }
}

export const storage = new DatabaseStorage();