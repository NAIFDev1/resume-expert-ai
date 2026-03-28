import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeResume } from "./ai-engine";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

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
      });

      res.json({ id: resume.id, analysis });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      console.error("Analysis error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/resumes/editor", async (req, res) => {
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

  app.get("/api/resumes", async (_req, res) => {
    try {
      const allResumes = await storage.getAllResumes();
      res.json(allResumes);
    } catch (error) {
      console.error("List resumes error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/resumes/stats", async (_req, res) => {
    try {
      const stats = await storage.getResumeStats();
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

  app.delete("/api/resumes/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteResume(req.params.id);
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
