import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Tabellendefinitionen
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const socialAccounts = pgTable("social_accounts", {
  id: serial("id").primaryKey(),
  platform: text("platform").notNull(),
  accountName: text("account_name").notNull(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  tokenExpiresAt: timestamp("token_expires_at"),
  platformUserId: text("platform_user_id"),
  platformPageId: text("platform_page_id"),
});

export const todos = pgTable("todos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  completed: boolean("completed").notNull().default(false),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  assignedToUserId: integer("assigned_to_user_id").references(() => users.id),
  deadline: timestamp("deadline"),
});

export const subtasks = pgTable("subtasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  completed: boolean("completed").notNull().default(false),
  todoId: integer("todo_id").notNull().references(() => todos.id, { onDelete: "cascade" }),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  imageData: text("image_data"),
  scheduledDate: timestamp("scheduled_date").notNull(),
  approved: boolean("approved").notNull().default(false),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "restrict" }),
  accountId: integer("account_id").notNull().references(() => socialAccounts.id, { onDelete: "restrict" }),
  lastEditedAt: timestamp("last_edited_at"),
  lastEditedByUserId: integer("last_edited_by_user_id").references(() => users.id),
  platformPostId: text("platform_post_id"),
  visibility: text("visibility").default("public"),
  articleUrl: text("article_url"),
  postType: text("post_type").default("post"),
  publishStatus: text("publish_status").default("draft"),
  failureReason: text("failure_reason"),
  deletedAt: timestamp("deleted_at"),
  scheduledInLinkedIn: boolean("scheduled_in_linkedin").default(false),
});

export const postAccounts = pgTable("post_accounts", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  accountId: integer("account_id").notNull().references(() => socialAccounts.id, { onDelete: "cascade" }),
});

export const postAnalytics = pgTable("post_analytics", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  impressions: integer("impressions").default(0),
  clicks: integer("clicks").default(0),
  likes: integer("likes").default(0),
  shares: integer("shares").default(0),
  comments: integer("comments").default(0),
  engagementRate: integer("engagement_rate").default(0),
  demographicData: jsonb("demographic_data"),
  updatedAt: timestamp("updated_at").notNull(),
});

export const postComments = pgTable("post_comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  postId: integer("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const newsletters = pgTable("newsletters", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
});

export const backups = pgTable("backups", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size").notNull(),
  status: text("status").notNull().default("pending"),
  completedAt: timestamp("completed_at"),
  error: text("error"),
});

// Beziehungsdefinitionen
export const usersRelations = relations(users, ({ many }) => ({
  todos: many(todos),
  assignedTodos: many(todos, { relationName: "assignedTodos" }),
  posts: many(posts),
  newsletters: many(newsletters),
  socialAccounts: many(socialAccounts),
}));

export const socialAccountsRelations = relations(socialAccounts, ({ one, many }) => ({
  user: one(users, {
    fields: [socialAccounts.userId],
    references: [users.id],
  }),
  posts: many(postAccounts),
}));

export const todosRelations = relations(todos, ({ one, many }) => ({
  user: one(users, {
    fields: [todos.userId],
    references: [users.id],
  }),
  assignedTo: one(users, {
    fields: [todos.assignedToUserId],
    references: [users.id],
    relationName: "assignedTodos",
  }),
  subtasks: many(subtasks),
}));

export const subtasksRelations = relations(subtasks, ({ one }) => ({
  todo: one(todos, {
    fields: [subtasks.todoId],
    references: [todos.id],
  }),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  account: one(socialAccounts, {
    fields: [posts.accountId],
    references: [socialAccounts.id],
  }),
  lastEditedBy: one(users, {
    fields: [posts.lastEditedByUserId],
    references: [users.id],
  }),
  analytics: one(postAnalytics, {
    fields: [posts.id],
    references: [postAnalytics.postId],
  }),
  comments: many(postComments),
}));

export const postCommentsRelations = relations(postComments, ({ one }) => ({
  post: one(posts, {
    fields: [postComments.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [postComments.userId],
    references: [users.id],
  }),
}));

export const postAnalyticsRelations = relations(postAnalytics, ({ one }) => ({
  post: one(posts, {
    fields: [postAnalytics.postId],
    references: [posts.id],
  }),
}));

export const newslettersRelations = relations(newsletters, ({ one }) => ({
  user: one(users, {
    fields: [newsletters.userId],
    references: [users.id],
  }),
}));

// Basis-Typen ohne Zod
export type User = typeof users.$inferSelect;
export type Todo = typeof todos.$inferSelect & {
  subtasks?: SubTask[];
  assignedTo?: User;
};
export type Post = typeof posts.$inferSelect & {
  account?: SocialAccount;
  lastEditedBy?: User;
  analytics?: PostAnalytics;
  comments?: PostComment[];
};
export type Newsletter = typeof newsletters.$inferSelect;
export type SocialAccount = typeof socialAccounts.$inferSelect;
export type PostAnalytics = typeof postAnalytics.$inferSelect;
export type SubTask = typeof subtasks.$inferSelect;
export type Backup = typeof backups.$inferSelect;
export type PostComment = typeof postComments.$inferSelect & {
  user?: User;
};

// Einfache Insert-Typen
export type InsertUser = {
  username: string;
  password: string;
};

export type InsertTodo = {
  title: string;
  description?: string;
  userId: number;
  assignedToUserId?: number;
  deadline?: Date;
};

export type InsertSubtask = {
  title: string;
  todoId: number;
  completed?: boolean;
};

export type InsertPost = {
  content: string;
  scheduledDate: Date;
  userId: number;
  accountId: number;
  imageUrl?: string;
  visibility?: string;
  postType?: string;
  articleUrl?: string;
};

export type InsertSocialAccount = {
  platform: string;
  accountName: string;
  userId: number;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiresAt?: Date;
  platformUserId?: string;
  platformPageId?: string;
};

export type InsertNewsletter = {
  title: string;
  content: string;
  userId: number;
};

export type InsertBackup = {
  fileName: string;
  fileSize: number;
  status?: string;
};

export type InsertPostComment = {
  content: string;
  postId: number;
  userId: number;
}; 