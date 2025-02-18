import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  todos: many(todos),
  posts: many(posts),
  newsletters: many(newsletters),
  socialAccounts: many(socialAccounts),
}));

// Neue Tabelle für Social Media Accounts
export const socialAccounts = pgTable("social_accounts", {
  id: serial("id").primaryKey(),
  platform: text("platform").notNull(), // "LinkedIn", "Instagram", "Facebook", etc.
  accountName: text("account_name").notNull(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  tokenExpiresAt: timestamp("token_expires_at"),
  platformUserId: text("platform_user_id"), // LinkedIn User ID
  platformPageId: text("platform_page_id"), // LinkedIn Page/Company ID if applicable
});

export const socialAccountsRelations = relations(socialAccounts, ({ one, many }) => ({
  user: one(users, {
    fields: [socialAccounts.userId],
    references: [users.id],
  }),
  posts: many(postAccounts),
}));

// Im todos-Table das description Feld hinzufügen
export const todos = pgTable("todos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  completed: boolean("completed").notNull().default(false),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
});

export const todosRelations = relations(todos, ({ one }) => ({
  user: one(users, {
    fields: [todos.userId],
    references: [users.id],
  }),
}));

// Im posts-Table das imageUrl Feld hinzufügen and accountId
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  scheduledDate: timestamp("scheduled_date").notNull(),
  approved: boolean("approved").notNull().default(false),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  accountId: integer("account_id").notNull().references(() => socialAccounts.id, { onDelete: "cascade" }),
  lastEditedAt: timestamp("last_edited_at"),
  lastEditedByUserId: integer("last_edited_by_user_id").references(() => users.id),
  platformPostId: text("platform_post_id"), // LinkedIn post ID after publishing
  visibility: text("visibility").default("public"), // public, connections, private
  articleUrl: text("article_url"), // For LinkedIn articles
  postType: text("post_type").default("post"), // post, article, poll, etc.
  publishStatus: text("publish_status").default("draft"), // draft, scheduled, published, failed
  failureReason: text("failure_reason"), // Store error message if publishing fails
});

// Verbindungstabelle zwischen Posts und Social Accounts
export const postAccounts = pgTable("post_accounts", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  accountId: integer("account_id").notNull().references(() => socialAccounts.id, { onDelete: "cascade" }),
});

// Add analytics table for tracking post performance
export const postAnalytics = pgTable("post_analytics", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  impressions: integer("impressions").default(0),
  clicks: integer("clicks").default(0),
  likes: integer("likes").default(0),
  shares: integer("shares").default(0),
  comments: integer("comments").default(0),
  engagementRate: integer("engagement_rate").default(0),
  demographicData: jsonb("demographic_data"), // Store LinkedIn demographic insights
  updatedAt: timestamp("updated_at").notNull(),
});

// Add relations for analytics
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

// Schema für Social Account Erstellung
export const insertSocialAccountSchema = createInsertSchema(socialAccounts)
  .pick({
    platform: true,
    accountName: true,
  })
  .extend({
    code: z.string().optional(), // For OAuth flow
  });

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Das insertTodoSchema aktualisieren
export const insertTodoSchema = createInsertSchema(todos).pick({
  title: true,
  description: true,
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
    image: z.instanceof(File).optional(),
  });

export const insertNewsletterSchema = createInsertSchema(newsletters).pick({
  title: true,
  content: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Todo = typeof todos.$inferSelect;
export type Post = typeof posts.$inferSelect & {
  account?: SocialAccount;
  lastEditedBy?: User;
  analytics?: PostAnalytics;
};
export type Newsletter = typeof newsletters.$inferSelect;
export type SocialAccount = typeof socialAccounts.$inferSelect;
export type InsertSocialAccount = z.infer<typeof insertSocialAccountSchema>;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type PostAnalytics = typeof postAnalytics.$inferSelect;