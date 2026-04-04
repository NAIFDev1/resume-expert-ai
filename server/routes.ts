import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeResume } from "./ai-engine";
import { extractTextFromFile } from "./text-extractor";
import { hashPassword } from "./auth";
import { z } from "zod";
import passport from "passport";
import multer from "multer";

declare global {
  namespace Express {
    interface User {
      id: string;
      username: string;
      password: string;
    }
  }
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(null, false);
  },
});

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
  app.post("/api/resumes/analyze", upload.single("file"), async (req, res) => {
    try {
      const fileName = req.body.fileName || req.file?.originalname || "resume";
      const fileType = req.file?.mimetype || req.body.fileType || "application/pdf";
      const jobDescription = req.body.jobDescription || undefined;

      if (!fileName) return res.status(400).json({ message: "fileName is required" });

      let resumeText = "";
      let meta: { pageCount?: number; wordCount: number; method: string } = {
        wordCount: 0,
        method: "filename-only",
      };

      if (req.file?.buffer) {
        const extracted = await extractTextFromFile(req.file.buffer, fileName, fileType);
        resumeText = extracted.text;
        meta = {
          pageCount: extracted.pageCount,
          wordCount: extracted.wordCount,
          method: extracted.method,
        };
        console.log(`[Extract] ${fileName}: ${meta.wordCount} words via ${meta.method}`);
      }

      const analysis = await analyzeResume(fileName, resumeText, jobDescription, meta);
      const userId = req.isAuthenticated() ? req.user!.id : null;

      const analysisWithMeta = { ...analysis, _meta: meta };

      const resume = await storage.createResume({
        fileName,
        fileType,
        jobDescription: jobDescription || null,
        type: "analysis",
        score: analysis.score,
        matchRate: analysis.matchRate || null,
        analysisResult: analysisWithMeta,
        template: null,
        resumeData: null,
        userId,
      });

      res.json({ id: resume.id, analysis: analysisWithMeta, saved: !!userId, meta });
    } catch (error: any) {
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
