import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeResume } from "./ai-engine";
import { hashPassword } from "./auth";
import { z } from "zod";
import passport from "passport";

declare global {
  namespace Express {
    interface User {
      id: string;
      username: string;
      password: string;
    }
  }
}

function requireAuth(req: Request, res: Response, next: Function) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Unauthorized" });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // ─── Auth Routes ─────────────────────────────────────────────
  app.post("/api/auth/register", async (req, res) => {
    try {
      const schema = z.object({
        username: z.string().min(3, "Username must be at least 3 characters"),
        password: z.string().min(6, "Password must be at least 6 characters"),
      });
      const { username, password } = schema.parse(req.body);

      const existing = await storage.getUserByUsername(username);
      if (existing) {
        return res.status(409).json({ message: "Username already taken" });
      }

      const hashed = await hashPassword(password);
      const user = await storage.createUser({ username, password: hashed });

      req.login(user, (err) => {
        if (err) return res.status(500).json({ message: "Login failed after register" });
        res.json({ id: user.id, username: user.username });
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Register error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: info?.message || "Invalid credentials" });
      req.login(user, (loginErr) => {
        if (loginErr) return next(loginErr);
        res.json({ id: user.id, username: user.username });
      });
    })(req, res, next);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ message: "Logout failed" });
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.json(null);
    }
    res.json({ id: req.user!.id, username: req.user!.username });
  });

  // ─── Resume Routes ────────────────────────────────────────────
  app.post("/api/resumes/analyze", async (req, res) => {
    try {
      const schema = z.object({
        fileName: z.string().min(1),
        fileType: z.string().min(1),
        jobDescription: z.string().optional(),
      });

      const data = schema.parse(req.body);
      const analysis = analyzeResume(data.fileName, data.jobDescription);

      if (data.jobDescription && !analysis.matchRate) {
        analysis.matchRate = 72;
      }

      const userId = req.isAuthenticated() ? req.user!.id : null;

      const resume = await storage.createResume({
        fileName: data.fileName,
        fileType: data.fileType,
        jobDescription: data.jobDescription || null,
        type: "analysis",
        score: analysis.score,
        matchRate: analysis.matchRate || null,
        analysisResult: analysis,
        template: null,
        resumeData: null,
        userId,
      });

      res.json({ id: resume.id, analysis, saved: !!userId });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      console.error("Analysis error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/resumes/editor", requireAuth, async (req, res) => {
    try {
      const schema = z.object({
        fileName: z.string().default("Untitled Resume"),
        template: z.string().default("classic"),
        resumeData: z.object({
          fullName: z.string(),
          jobTitle: z.string(),
          email: z.string(),
          phone: z.string(),
          summary: z.string(),
          experience: z.string(),
          education: z.string(),
        }),
      });

      const data = schema.parse(req.body);

      const resume = await storage.createResume({
        fileName: data.fileName,
        fileType: "editor",
        template: data.template,
        type: "editor",
        score: null,
        matchRate: null,
        analysisResult: null,
        jobDescription: null,
        resumeData: data.resumeData,
        userId: req.user!.id,
      });

      res.json(resume);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      console.error("Editor save error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/resumes", requireAuth, async (req, res) => {
    try {
      const userResumes = await storage.getResumesByUser(req.user!.id);
      res.json(userResumes);
    } catch (error) {
      console.error("List resumes error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/resumes/stats", requireAuth, async (req, res) => {
    try {
      const stats = await storage.getResumeStats(req.user!.id);
      res.json(stats);
    } catch (error) {
      console.error("Stats error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/resumes/:id", async (req, res) => {
    try {
      const resume = await storage.getResume(req.params.id);
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }
      res.json(resume);
    } catch (error) {
      console.error("Get resume error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/resumes/:id", requireAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteResume(String(req.params.id), req.user!.id);
      if (!deleted) {
        return res.status(404).json({ message: "Resume not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Delete resume error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
