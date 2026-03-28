# Khabir (خبير) - AI Resume Analysis Platform

## Overview
Full-stack bilingual (Arabic/English) resume analysis platform with ATS scoring, skill gap analysis, AI-driven improvement suggestions, a live resume editor with templates, and PDF export.

## Tech Stack
- **Frontend**: React 19, Vite, TailwindCSS v4, shadcn/ui, Framer Motion, Recharts, wouter, TanStack Query
- **Backend**: Express 5 (Node.js), TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Fonts**: Cairo (UI), AlKhattAlYadawey (hero headings only via `font-handwritten`)

## Architecture
- `client/` — React SPA (pages, components, lib)
- `server/` — Express API (`routes.ts`, `storage.ts`, `db.ts`, `ai-engine.ts`)
- `shared/schema.ts` — Drizzle schema + Zod insert schemas (users, resumes)

## Database Schema
- **users**: id (uuid), username, password
- **resumes**: id (uuid), fileName, fileType, jobDescription, template, type ("analysis"|"editor"), score, matchRate, analysisResult (jsonb), resumeData (jsonb), createdAt

## API Routes (prefix: `/api`)
- `POST /api/resumes/analyze` — Analyze uploaded resume (fileName, fileType, jobDescription?)
- `POST /api/resumes/editor` — Save editor resume data
- `GET /api/resumes` — List all resumes (ordered by createdAt desc)
- `GET /api/resumes/stats` — Dashboard stats (totalFiles, avgScore, templatesUsed)
- `GET /api/resumes/:id` — Get single resume + analysis result
- `DELETE /api/resumes/:id` — Delete a resume record

## Key Pages
- `/` — Home with hero, upload zone, features, templates preview
- `/analysis?id=<uuid>` — Analysis results fetched from API
- `/editor` — Live resume editor with 3 templates, PDF export, save to DB
- `/dashboard` — Real data from API (stats, records table, delete)
- `/templates`, `/faq`, `/login` — Static/info pages

## Design Rules
- `font-handwritten` (AlKhattAlYadawey) ONLY for hero h1 / section titles
- `font-sans` = Cairo for all UI text
- Link pattern: `<Link href="..."><div>` or `<Link href="..."><span>` — NEVER `<Link><a>`
- Page top padding: Home `pt-32`, Analysis/Editor/Dashboard `pt-40 lg:pt-48`
- FloatingNav rendered globally in `App.tsx` only
- Theme: Modern SaaS (Stripe/Linear/Notion-inspired), `--radius: 1rem`
- All analysis is simulated via `server/ai-engine.ts` (no real AI/LLM integration)
