# Khabir AI — خبير

**AI-Powered Resume Analyzer & ATS Optimizer** | مشروع تخرج

Khabir (خبير) is a full-stack resume analysis and improvement platform. Upload your resume, get a detailed ATS compatibility analysis with skills detection and actionable recommendations, then rebuild your resume in an ATS-friendly format with AI-assisted writing tools.

---

## Features

- **Resume Upload & Text Extraction** — Upload PDF, DOCX, or legacy DOC files; text is extracted server-side (PDF via `pdf-parse`, DOCX via `mammoth`).
- **ATS Analysis** — Instant ATS compatibility scored against a job description: detected skills, missing skills, and a checklist of common ATS criteria.
- **Skills Radar & Suggestions** — Visual breakdown of detected skills plus AI-driven improvement suggestions.
- **AI Resume Editor** — Build a resume from scratch or edit an extracted one:
  - Personal info, professional summary
  - Structured work experience entries (role, company, dates, achievement bullets)
  - Skills chips and links (LinkedIn / GitHub / portfolio)
  - **Single ATS-compliant template** — clean single-column layout, standard section headings, plain-text contact info, comma-separated skills.
- **AI Improve & Translate** — One-click rewrites and Arabic ⇄ English translation. Falls back to built-in deterministic quality when no OpenAI key is configured.
- **Autosave & Saved Resumes** — Edits auto-save; open any previously saved resume from the dashboard.
- **PDF Export** — Print / save the resume as PDF directly from the editor.
- **Authentication** — Secure sign up / login with session cookie stored in MySQL.
- **RTL/Arabic support** — Full bilingual UI (Arabic & English).

---

## Tech Stack

| Layer      | Technology                                                            |
|------------|-----------------------------------------------------------------------|
| Frontend   | React 18 · TypeScript · Vite · Tailwind CSS · shadcn/ui · Radix UI · Framer Motion · react-to-print |
| Backend    | Node.js · Express 5 · Passport.js · Multer                          |
| Database   | MySQL 8 · Drizzle ORM · express-mysql-session                       |
| AI         | OpenAI-compatible API (optional) · MyMemory free translation fallback |
| Documents  | pdf-parse · mammoth · text extraction pipeline                      |
| Build      | esbuild single-file bundle → `dist/index.cjs`                       |

---

## Project Structure

```
├── client/              # React SPA
│   └── src/
│       ├── components/  # UI, layout, dashboard & home components
│       └── pages/       # Home, Analysis, Editor, Dashboard, Templates, FAQ, Auth
├── server/
│   ├── ai-engine.ts     # AI prompts, translation & improvement logic
│   ├── text-extractor.ts# PDF/DOCX text extraction
│   ├── routes.ts        # REST API endpoints
│   ├── auth.ts          # Passport + MySQL session store
│   ├── storage.ts       # Data access layer
│   ├── db.ts            # MySQL pool
│   └── index.ts         # App bootstrap (serves API + built SPA)
├── shared/
│   ├── schema.ts        # Drizzle schema (users, resumes, sessions, chat)
│   └── models/          # Shared type models
└── script/build.ts      # esbuild production build
```

---

## Getting Started

### Prerequisites

- Node.js 20+ (developed on v24)
- MySQL 8 (local instance with an empty database)

### 1. Configure environment

Copy this into a `.env` file at the project root:

```env
# MySQL connection (create the database first)
DATABASE_URL=mysql://root:password@localhost:3306/resume_expert

# Required for sessions — any long random string
SESSION_SECRET=change-me-to-a-long-random-string

# Optional: enables real LLM-powered analysis, improve & translation
# AI_INTEGRATIONS_OPENAI_API_KEY=sk-...
# AI_INTEGRATIONS_OPENAI_BASE_URL=https://api.openai.com/v1
```

### 2. Install & create the schema

```bash
npm install
npm run db:push        # creates tables using Drizzle Kit
```

### 3. Run in development

```bash
npm run dev            # backend with hot reload (tsx watch)
npm run dev:client     # Vite dev server
```

### 4. Production build & run

```bash
npm run check          # TypeScript typecheck
npm run build          # bundles server into dist/index.cjs
npm run start          # starts production server (serves API + built frontend)
```

---

## API Endpoints

| Method | Endpoint                     | Auth    | Description                                  |
|--------|------------------------------|---------|----------------------------------------------|
| POST   | `/api/auth/register`         | Public  | Create an account                            |
| POST   | `/api/auth/login`            | Public  | Sign in (sets session cookie)                |
| POST   | `/api/auth/logout`           | Auth    | Sign out                                     |
| GET    | `/api/auth/me`               | Auth    | Current user                                  |
| POST   | `/api/resumes/analyze`       | Public  | Upload resume file → extraction + ATS analysis |
| POST   | `/api/resumes/editor`        | Auth    | Save a new resume from the editor            |
| PUT    | `/api/resumes/editor/:id`    | Auth    | Autosave / update a saved resume             |
| POST   | `/api/resumes/improve`       | Public  | AI rewrite of resume content                 |
| POST   | `/api/resumes/translate`     | Public  | Translate resume (ar ⇄ en)                   |
| GET    | `/api/resumes`               | Auth    | List current user's resumes                  |
| GET    | `/api/resumes/:id`           | Public  | Fetch a single resume                        |
| GET    | `/api/resumes/stats`         | Auth    | Dashboard statistics                         |
| DELETE | `/api/resumes/:id`           | Auth    | Delete a resume                              |

> **Note on AI endpoints:** when no OpenAI key is set, `/api/resumes/analyze`, `/api/resumes/improve`, and `/api/resumes/translate` run in a built-in fallback mode so the whole flows still work offline — just with deterministic (non-LLM) quality.

---

## Current Feature Notes

- The editor ships a **single ATS template** — the UI no longer offers multiple style templates; every resume is produced in the ATS-friendly format.
- Production session cookies are sent over plain HTTP by default (`COOKIE_SECURE=1` enables secure cookies when HTTPS is terminated elsewhere).

---

## Graduation Project Details

Khabir AI is a graduation project focused on **helping Arabic-speaking job seekers pass automated ATS filters**. It demonstrates:

- Full-stack TypeScript architecture (React + Express + MySQL)
- Document text-extraction pipeline handling PDF/DOCX
- AI integration with graceful fallback (works without paid API keys)
- RTL-first bilingual UX and accessibility-minded components
- Data persistence, authentication, and file upload handling

---

## License

This project is for academic / graduation purposes. See repository owner for licensing.