# Khabir (خبير) - AI Resume Analysis Platform

## Overview
Full-stack bilingual (Arabic/English) resume analysis platform with ATS scoring, skill gap analysis, AI-driven improvement suggestions, a live resume editor with 3 templates, PDF export, dashboard with history, and user authentication (login/register + guest mode).

## Tech Stack
- **Frontend**: React 19, Vite, TailwindCSS v4, shadcn/ui, Framer Motion, Recharts, wouter, TanStack Query
- **Backend**: Express 5 (Node.js), TypeScript, Passport.js (local strategy), express-session, bcryptjs
- **Database**: PostgreSQL with Drizzle ORM
- **Fonts**: Cairo (UI), AlKhattAlYadawey (hero headings only via `font-handwritten`)

## Architecture
- `client/` — React SPA (pages, components, lib, hooks)
- `server/` — Express API (`routes.ts`, `storage.ts`, `db.ts`, `ai-engine.ts`, `auth.ts`)
- `shared/schema.ts` — Drizzle schema + Zod insert schemas (users, resumes)

## Auth System
- `server/auth.ts` — Passport local strategy setup + session config + bcrypt helpers
- `setupAuth(app)` called in `server/index.ts` before routes
- Sessions stored in MemoryStore (memorystore package)
- Session secret from `SESSION_SECRET` env var (fallback default)
- `client/src/hooks/useAuth.ts` — React hook for login/register/logout/user state

## Access Control
- **Guests**: Can analyze resumes (POST /api/resumes/analyze) and view results; NO history saved to account; Dashboard blocked (redirects to /login); Editor shows amber banner
- **Authenticated**: Full access — resumes saved with userId; Dashboard shows history; Editor saves to account
- Guest banner on Analysis page: blue primary-color banner with "Sign In" CTA
- Guest banner on Editor page: amber banner with "Sign In" CTA

## Database Schema
- **users**: id (uuid), username (unique), password (bcrypt hash), createdAt
- **resumes**: id (uuid), userId (nullable fk → users), fileName, fileType, jobDescription, template, type ("analysis"|"editor"), score, matchRate, analysisResult (jsonb), resumeData (jsonb), createdAt

## API Routes (prefix: `/api`)
### Auth (public)
- `POST /api/auth/register` — Register (username, password min 6 chars) → returns user + sets session
- `POST /api/auth/login` — Login with passport local → returns user + sets session  
- `POST /api/auth/logout` — Destroys session
- `GET /api/auth/me` — Returns current user or null

### Resumes
- `POST /api/resumes/analyze` — Public; saves with userId if authenticated; returns `{id, analysis, saved}`
- `POST /api/resumes/editor` — **Protected**; saves editor resume for current user
- `GET /api/resumes` — **Protected**; list user's resumes (ordered by createdAt desc)
- `GET /api/resumes/stats` — **Protected**; stats (totalFiles, avgScore, templatesUsed)
- `GET /api/resumes/:id` — Public; fetch single resume by id
- `DELETE /api/resumes/:id` — **Protected**; delete resume

## Key Pages
- `/` — Home with hero, upload zone, features, templates preview
- `/analysis?id=<uuid>` — Analysis results with ATS score, skill radar, suggestions. Guest banner shown
- `/dashboard` — Protected: resume history, stats, delete. Welcome back message with username
- `/editor` — Resume editor with 3 templates + PDF export. Guest amber banner. Save requires auth
- `/login` (= `/register`) — Auth page with tabs for Login/Register + Guest browse option
- `/templates` — Templates showcase
- `/faq` — FAQ page

## UI Rules
- `font-handwritten` (AlKhattAlYadawey) ONLY for hero h1/section titles and the خ logo
- `font-sans` = Cairo for all UI text
- FloatingNav rendered ONLY in `App.tsx` globally — not in individual pages
- Page top padding: `pt-40 lg:pt-48`; Home hero `pt-32`
- Link pattern: `<Link href="..."><div>` or `<span>` — NEVER `<Link><a>`
- `--radius: 1rem`, `.shadow-soft` / `.shadow-soft-lg` in index.css
