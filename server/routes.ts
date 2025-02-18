import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import express from "express";
import { insertTodoSchema, insertPostSchema, insertNewsletterSchema, insertSocialAccountSchema } from "@shared/schema";

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error("Nur Bilder sind erlaubt"));
      return;
    }
    cb(null, true);
  },
});

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Serve uploaded files
  app.use("/uploads", express.static("uploads"));

  // Get all users for assignment
  app.get("/api/users", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const users = await storage.getUsers();
      // Remove passwords from response
      const safeUsers = users.map(({ password, ...user }) => user);
      res.json(safeUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Todo routes
  app.get("/api/todos", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const todos = await storage.getTodos();
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

      const todoData = {
        ...parsed.data,
        userId: req.user.id,
        deadline: parsed.data.deadline ? new Date(parsed.data.deadline) : undefined,
      };

      const todo = await storage.createTodo(todoData);
      res.json(todo);
    } catch (error) {
      console.error("Error creating todo:", error);
      res.status(500).json({ message: "Failed to create todo" });
    }
  });

  app.patch("/api/todos/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const todo = await storage.updateTodo(Number(req.params.id), {
        completed: req.body.completed,
        deadline: req.body.deadline ? new Date(req.body.deadline) : undefined,
        assignedToUserId: req.body.assignedToUserId,
      });
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

  // New Subtask-Routes
  app.post("/api/todos/:todoId/subtasks", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const subtask = await storage.createSubtask({
        title: req.body.title,
        todoId: Number(req.params.todoId),
      });
      res.json(subtask);
    } catch (error) {
      console.error("Error creating subtask:", error);
      res.status(500).json({ message: "Failed to create subtask" });
    }
  });

  app.patch("/api/subtasks/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const subtask = await storage.updateSubtask(
        Number(req.params.id),
        req.body.completed
      );
      res.json(subtask);
    } catch (error) {
      console.error("Error updating subtask:", error);
      res.status(500).json({ message: "Failed to update subtask" });
    }
  });

  app.delete("/api/subtasks/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      await storage.deleteSubtask(Number(req.params.id));
      res.sendStatus(200);
    } catch (error) {
      console.error("Error deleting subtask:", error);
      res.status(500).json({ message: "Failed to delete subtask" });
    }
  });


  // Post routes
  app.get("/api/posts", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const posts = await storage.getPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.post("/api/posts", upload.single("image"), async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
      const postData = {
        content: req.body.content,
        scheduledDate: new Date(req.body.scheduledDate),
        accountId: Number(req.body.accountIds[0]), // Nimm den ersten Account aus der Liste
        imageUrl,
        userId: req.user.id,
      };

      const post = await storage.createPost(postData);
      res.json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  app.patch("/api/posts/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      // Parse and validate the scheduled date
      let scheduledDate: Date | undefined;
      try {
        scheduledDate = req.body.scheduledDate ? new Date(req.body.scheduledDate) : undefined;
        if (scheduledDate && scheduledDate.toString() === "Invalid Date") {
          throw new Error("Invalid date format");
        }
      } catch (error) {
        return res.status(400).json({ message: "Invalid date format for scheduledDate" });
      }

      const post = await storage.updatePost(Number(req.params.id), {
        content: req.body.content,
        userId: req.user.id,
        scheduledDate,
        accountId: req.body.accountId ? Number(req.body.accountId) : undefined,
        imageUrl: req.body.imageUrl,
        visibility: req.body.visibility,
        postType: req.body.postType,
        articleUrl: req.body.articleUrl,
      });
      res.json(post);
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ message: "Failed to update post" });
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

  app.patch("/api/posts/:id/unapprove", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const post = await storage.unapprovePost(Number(req.params.id));
      res.json(post);
    } catch (error) {
      console.error("Error unapproving post:", error);
      res.status(500).json({ message: "Failed to unapprove post" });
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
      const newsletters = await storage.getNewsletters();
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

  app.patch("/api/newsletters/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const newsletter = await storage.updateNewsletter(Number(req.params.id), {
        title: req.body.title,
        content: req.body.content,
      });
      res.json(newsletter);
    } catch (error) {
      console.error("Error updating newsletter:", error);
      res.status(500).json({ message: "Failed to update newsletter" });
    }
  });

  app.delete("/api/newsletters/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      await storage.deleteNewsletter(Number(req.params.id));
      res.sendStatus(200);
    } catch (error) {
      console.error("Error deleting newsletter:", error);
      res.status(500).json({ message: "Failed to delete newsletter" });
    }
  });

  // Social Media Account Routen
  app.get("/api/social-accounts", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const accounts = await storage.getSocialAccounts();
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