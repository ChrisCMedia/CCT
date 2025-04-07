import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod/index.cjs";
import * as z from "zod/lib/index.js";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  todos: many(todos),
  assignedTodos: many(todos, { relationName: "assignedTodos" }),
  posts: many(posts),
  newsletters: many(newsletters),
  socialAccounts: many(socialAccounts),
}));

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

export const socialAccountsRelations = relations(socialAccounts, ({ one, many }) => ({
  user: one(users, {
    fields: [socialAccounts.userId],
    references: [users.id],
  }),
  posts: many(postAccounts),
}));

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

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
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

export const postAnalyticsRelations = relations(postAnalytics, ({ one }) => ({
  post: one(posts, {
    fields: [postAnalytics.postId],
    references: [posts.id],
  }),
}));

export const newsletters = pgTable("newsletters", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
});

export const newslettersRelations = relations(newsletters, ({ one }) => ({
  user: one(users, {
    fields: [newsletters.userId],
    references: [users.id],
  }),
}));

export const insertSocialAccountSchema = createInsertSchema(socialAccounts)
  .pick({
    platform: true,
    accountName: true,
  })
  .extend({
    code: z.string().optional(),
  });

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTodoSchema = createInsertSchema(todos)
  .pick({
    title: true,
    description: true,
    deadline: true,
    assignedToUserId: true,
  })
  .extend({
    deadline: z.string().optional(),
    subtasks: z.array(z.string()).optional(),
    assignedToUserId: z.number().optional(),
  });

export const insertSubtaskSchema = createInsertSchema(subtasks).pick({
  title: true,
  todoId: true,
});

export const insertPostSchema = createInsertSchema(posts)
  .pick({
    content: true,
    scheduledDate: true,
    imageUrl: true,
    visibility: true,
    postType: true,
    articleUrl: true,
  })
  .extend({
    scheduledDate: z.coerce.date(),
    accountIds: z.array(z.number()).min(1, "Mindestens ein Account muss ausgewählt werden"),
    image: z.any().optional(),
  });

export const insertNewsletterSchema = createInsertSchema(newsletters).pick({
  title: true,
  content: true,
});

export const insertPostCommentSchema = createInsertSchema(postComments).pick({
  content: true,
  postId: true,
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

export const insertBackupSchema = createInsertSchema(backups).pick({
  fileName: true,
  fileSize: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
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
export type InsertSocialAccount = z.infer<typeof insertSocialAccountSchema>;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type PostAnalytics = typeof postAnalytics.$inferSelect;
export type SubTask = typeof subtasks.$inferSelect;
export type Backup = typeof backups.$inferSelect;
export type InsertBackup = z.infer<typeof insertBackupSchema>;
export type PostComment = typeof postComments.$inferSelect & {
  user?: User;
};
export type InsertPostComment = z.infer<typeof insertPostCommentSchema>;