import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertTodoSchema, insertPostSchema, insertNewsletterSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Todo routes
  app.get("/api/todos", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const todos = await storage.getTodos(req.user.id);
    res.json(todos);
  });

  app.post("/api/todos", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const parsed = insertTodoSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const todo = await storage.createTodo({ ...parsed.data, userId: req.user.id });
    res.json(todo);
  });

  app.patch("/api/todos/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const todo = await storage.updateTodo(Number(req.params.id), req.body.completed);
    res.json(todo);
  });

  app.delete("/api/todos/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    await storage.deleteTodo(Number(req.params.id));
    res.sendStatus(200);
  });

  // Post routes
  app.get("/api/posts", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const posts = await storage.getPosts(req.user.id);
    res.json(posts);
  });

  app.post("/api/posts", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const parsed = insertPostSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const post = await storage.createPost({ ...parsed.data, userId: req.user.id });
    res.json(post);
  });

  app.patch("/api/posts/:id/approve", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const post = await storage.approvePost(Number(req.params.id));
    res.json(post);
  });

  app.delete("/api/posts/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    await storage.deletePost(Number(req.params.id));
    res.sendStatus(200);
  });

  // Newsletter routes
  app.get("/api/newsletters", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const newsletters = await storage.getNewsletters(req.user.id);
    res.json(newsletters);
  });

  app.post("/api/newsletters", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const parsed = insertNewsletterSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const newsletter = await storage.createNewsletter({ ...parsed.data, userId: req.user.id });
    res.json(newsletter);
  });

  const httpServer = createServer(app);
  return httpServer;
}
