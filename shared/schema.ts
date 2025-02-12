import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
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
}));

export const todos = pgTable("todos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  completed: boolean("completed").notNull().default(false),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
});

export const todosRelations = relations(todos, ({ one }) => ({
  user: one(users, {
    fields: [todos.userId],
    references: [users.id],
  }),
}));

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  scheduledDate: timestamp("scheduled_date").notNull(),
  approved: boolean("approved").notNull().default(false),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
});

export const postsRelations = relations(posts, ({ one }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
}));

export const newsletters = pgTable("newsletters", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  title: text("title").notNull(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
});

export const newslettersRelations = relations(newsletters, ({ one }) => ({
  user: one(users, {
    fields: [newsletters.userId],
    references: [users.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTodoSchema = createInsertSchema(todos).pick({
  title: true,
});

export const insertPostSchema = createInsertSchema(posts)
  .pick({
    content: true,
    scheduledDate: true,
  })
  .extend({
    scheduledDate: z.coerce.date(),
  });

export const insertNewsletterSchema = createInsertSchema(newsletters).pick({
  title: true,
  content: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Todo = typeof todos.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Newsletter = typeof newsletters.$inferSelect;