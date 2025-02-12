import { InsertUser, User, Todo, Post, Newsletter } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Todo operations
  getTodos(userId: number): Promise<Todo[]>;
  createTodo(todo: { title: string; userId: number }): Promise<Todo>;
  updateTodo(id: number, completed: boolean): Promise<Todo>;
  deleteTodo(id: number): Promise<void>;
  
  // Post operations
  getPosts(userId: number): Promise<Post[]>;
  createPost(post: { content: string; scheduledDate: Date; userId: number }): Promise<Post>;
  approvePost(id: number): Promise<Post>;
  deletePost(id: number): Promise<void>;
  
  // Newsletter operations
  getNewsletters(userId: number): Promise<Newsletter[]>;
  createNewsletter(newsletter: { title: string; content: string; userId: number }): Promise<Newsletter>;
  
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private todos: Map<number, Todo>;
  private posts: Map<number, Post>;
  private newsletters: Map<number, Newsletter>;
  sessionStore: session.SessionStore;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.todos = new Map();
    this.posts = new Map();
    this.newsletters = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getTodos(userId: number): Promise<Todo[]> {
    return Array.from(this.todos.values()).filter(todo => todo.userId === userId);
  }

  async createTodo(todo: { title: string; userId: number }): Promise<Todo> {
    const id = this.currentId++;
    const newTodo: Todo = { ...todo, id, completed: false };
    this.todos.set(id, newTodo);
    return newTodo;
  }

  async updateTodo(id: number, completed: boolean): Promise<Todo> {
    const todo = this.todos.get(id);
    if (!todo) throw new Error("Todo not found");
    const updatedTodo = { ...todo, completed };
    this.todos.set(id, updatedTodo);
    return updatedTodo;
  }

  async deleteTodo(id: number): Promise<void> {
    this.todos.delete(id);
  }

  async getPosts(userId: number): Promise<Post[]> {
    return Array.from(this.posts.values()).filter(post => post.userId === userId);
  }

  async createPost(post: { content: string; scheduledDate: Date; userId: number }): Promise<Post> {
    const id = this.currentId++;
    const newPost: Post = { ...post, id, approved: false };
    this.posts.set(id, newPost);
    return newPost;
  }

  async approvePost(id: number): Promise<Post> {
    const post = this.posts.get(id);
    if (!post) throw new Error("Post not found");
    const updatedPost = { ...post, approved: true };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }

  async deletePost(id: number): Promise<void> {
    this.posts.delete(id);
  }

  async getNewsletters(userId: number): Promise<Newsletter[]> {
    return Array.from(this.newsletters.values()).filter(newsletter => newsletter.userId === userId);
  }

  async createNewsletter(newsletter: { title: string; content: string; userId: number }): Promise<Newsletter> {
    const id = this.currentId++;
    const newNewsletter: Newsletter = { ...newsletter, id };
    this.newsletters.set(id, newNewsletter);
    return newNewsletter;
  }
}

export const storage = new MemStorage();
