import { randomUUID } from "node:crypto";
import { type User, type InsertUser, type Resume, type InsertResume, users, resumes } from "@shared/schema";
import { db } from "./db";
import { and, eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createResume(data: InsertResume): Promise<Resume>;
  updateResume(id: string, data: Partial<Pick<InsertResume, "fileName" | "template" | "resumeData">>): Promise<Resume | undefined>;
  getResume(id: string): Promise<Resume | undefined>;
  getResumesByUser(userId: string): Promise<Resume[]>;
  deleteResume(id: string, userId?: string): Promise<boolean>;
  getResumeStats(userId: string): Promise<{ totalFiles: number; avgScore: number; templatesUsed: number }>;
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
    const id = randomUUID();
    await db.insert(users).values({ ...insertUser, id });
    const user = await this.getUser(id);
    if (!user) throw new Error("Failed to create user");
    return user;
  }

  async createResume(data: InsertResume): Promise<Resume> {
    const id = randomUUID();
    await db.insert(resumes).values({ ...data, id });
    const resume = await this.getResume(id);
    if (!resume) throw new Error("Failed to create resume");
    return resume;
  }

  async getResume(id: string): Promise<Resume | undefined> {
    const [resume] = await db.select().from(resumes).where(eq(resumes.id, id));
    return resume;
  }

  async updateResume(id: string, data: Partial<Pick<InsertResume, "fileName" | "template" | "resumeData">>): Promise<Resume | undefined> {
    await db.update(resumes)
      .set({ ...data })
      .where(eq(resumes.id, id));
    return this.getResume(id);
  }

  async getResumesByUser(userId: string): Promise<Resume[]> {
    return db.select().from(resumes)
      .where(eq(resumes.userId, userId))
      .orderBy(desc(resumes.createdAt));
  }

  async deleteResume(id: string, userId?: string): Promise<boolean> {
    const existing = await this.getResume(id);
    if (!existing) return false;
    if (userId && existing.userId !== userId) return false;
    await db.delete(resumes).where(eq(resumes.id, id));
    return true;
  }

  async getResumeStats(userId: string): Promise<{ totalFiles: number; avgScore: number; templatesUsed: number }> {
    const all = await db.select().from(resumes).where(eq(resumes.userId, userId));
    const totalFiles = all.length;
    const scores = all.filter(r => r.score != null).map(r => r.score!);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const templatesUsed = new Set(all.map(r => r.template).filter(Boolean)).size;
    return { totalFiles, avgScore, templatesUsed };
  }
}

export const storage = new DatabaseStorage();
