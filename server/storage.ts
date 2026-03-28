import { type User, type InsertUser, type Resume, type InsertResume, users, resumes } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createResume(data: InsertResume): Promise<Resume>;
  getResume(id: string): Promise<Resume | undefined>;
  getAllResumes(): Promise<Resume[]>;
  deleteResume(id: string): Promise<boolean>;
  getResumeStats(): Promise<{ totalFiles: number; avgScore: number; templatesUsed: number }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
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

  async createResume(data: InsertResume): Promise<Resume> {
    const [resume] = await db.insert(resumes).values(data).returning();
    return resume;
  }

  async getResume(id: string): Promise<Resume | undefined> {
    const [resume] = await db.select().from(resumes).where(eq(resumes.id, id));
    return resume;
  }

  async getAllResumes(): Promise<Resume[]> {
    return db.select().from(resumes).orderBy(desc(resumes.createdAt));
  }

  async deleteResume(id: string): Promise<boolean> {
    const result = await db.delete(resumes).where(eq(resumes.id, id)).returning();
    return result.length > 0;
  }

  async getResumeStats(): Promise<{ totalFiles: number; avgScore: number; templatesUsed: number }> {
    const all = await db.select().from(resumes);
    const totalFiles = all.length;
    const scores = all.filter(r => r.score != null).map(r => r.score!);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const templatesUsed = new Set(all.map(r => r.template).filter(Boolean)).size;
    return { totalFiles, avgScore, templatesUsed };
  }
}

export const storage = new DatabaseStorage();
