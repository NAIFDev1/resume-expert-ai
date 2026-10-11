import { sql } from "drizzle-orm";
import { mysqlTable, text, varchar, int, timestamp, json } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const resumes = mysqlTable("resumes", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  userId: varchar("user_id", { length: 36 }).references(() => users.id),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(),
  jobDescription: text("job_description"),
  // VARCHAR so MySQL allows DEFAULT (TEXT/BLOB cannot have defaults)
  template: varchar("template", { length: 64 }).default("classic"),
  type: varchar("type", { length: 64 }).notNull().default("analysis"),
  score: int("score"),
  matchRate: int("match_rate"),
  analysisResult: json("analysis_result"),
  resumeData: json("resume_data"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertResumeSchema = createInsertSchema(resumes).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertResume = z.infer<typeof insertResumeSchema>;
export type Resume = typeof resumes.$inferSelect;
