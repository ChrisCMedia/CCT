import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertTodoSchema, insertPostSchema, insertNewsletterSchema, insertSocialAccountSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Todo routes
  app.get("/api/todos", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const todos = await storage.getTodos(req.user.id);
      res.json(todos);
    } catch (error) {
      console.error("Error fetching todos:", error);
      res.status(500).json({ message: "Failed to fetch todos" });
    }
  });

  app.post("/api/todos", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const parsed = insertTodoSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json(parsed.error);
      const todo = await storage.createTodo({ ...parsed.data, userId: req.user.id });
      res.json(todo);
    } catch (error) {
      console.error("Error creating todo:", error);
      res.status(500).json({ message: "Failed to create todo" });
    }
  });

  app.patch("/api/todos/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const todo = await storage.updateTodo(Number(req.params.id), req.body.completed);
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

  // Post routes
  app.get("/api/posts", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const posts = await storage.getPosts(req.user.id);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.post("/api/posts", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const parsed = insertPostSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json(parsed.error);
      const post = await storage.createPost({ ...parsed.data, userId: req.user.id });
      res.json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ message: "Failed to create post" });
    }
  });

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

  // Newsletter routes
  app.get("/api/newsletters", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const newsletters = await storage.getNewsletters(req.user.id);
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

  // Neue Social Media Account Routen
  app.get("/api/social-accounts", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const accounts = await storage.getSocialAccounts(req.user.id);
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

  const httpServer = createServer(app);
  return httpServer;
}