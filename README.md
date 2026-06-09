# 🎓 Academic Pathway Recommendation Engine

An AI-powered web app that collects a user's profile, recommends the ideal academic credential — **Certification Program**, **DBA**, **PhD**, or **Honorary Doctorate** — stores every submission, and exposes an admin dashboard. Built for the AcdyOn Technical Internship Challenge.

## ✨ Features

- **Smart recommendation engine** — a deterministic rules engine scores all four pathways from qualification, experience, profession, and career goal.
- **AI-generated explanations** — a free [OpenRouter](https://openrouter.ai) model writes a personalised, human-sounding rationale (with automatic fallback across several free models, then to a rules-based reason if the API is unavailable).
- **Confirmation emails** — optional [Resend](https://resend.com) integration emails the user their recommendation (gracefully skipped if not configured).
- **Submissions dashboard** (`/submissions`) — live stats per recommendation type, full-text **search**, **filter** by recommendation, and **CSV export**. No auth required, per spec.
- **Modern glassmorphism UI** — frosted cards, gradient backdrop, responsive on mobile and desktop.
- **Loading states & skeletons** — spinner on submit, skeleton screens on the dashboard.
- **Robust error handling** — server-side validation, graceful degradation, and friendly client errors.
- **Analytics** — Vercel Web Analytics out of the box.

## 🧱 Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS |
| Database | Supabase (Postgres) |
| AI | OpenRouter (free models) |
| Email | Resend (optional) |
| Analytics | Vercel Analytics |
| Hosting | Vercel |

## 🏗️ Architecture

```
Browser ──▶ / (form)
              │  POST /api/submit
              ▼
        ┌─────────────────────────────────────────┐
        │  src/app/api/submit/route.ts             │
        │  1. validate input                        │
        │  2. getRecommendation()  ← rules engine   │
        │  3. generateExplanation() ← OpenRouter AI │
        │  4. insert into Supabase                  │
        │  5. sendRecommendationEmail() ← Resend    │
        └─────────────────────────────────────────┘
              │
              ▼
        Supabase `submissions` table
              ▲
              │  server fetch
        /submissions (dashboard: stats, search, filter, CSV)
```

Key files:

- [`src/lib/recommend.ts`](src/lib/recommend.ts) — rules-based scoring engine
- [`src/lib/ai.ts`](src/lib/ai.ts) — OpenRouter explanation generator with free-model fallback
- [`src/lib/email.ts`](src/lib/email.ts) — Resend confirmation email (graceful no-op)
- [`src/lib/supabase.ts`](src/lib/supabase.ts) — lazy Supabase client
- [`src/app/api/submit/route.ts`](src/app/api/submit/route.ts) — submission API
- [`src/app/page.tsx`](src/app/page.tsx) — profile form + result
- [`src/app/submissions/`](src/app/submissions) — admin dashboard

## 🚀 Getting Started

### 1. Install

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon key |
| `OPENROUTER_API_KEY` | optional | AI explanations (falls back to rules engine) |
| `RESEND_API_KEY` | optional | Confirmation emails |
| `EMAIL_FROM` | optional | Sender address for emails |

### 3. Set up the database

In the Supabase SQL Editor, run [`supabase/schema.sql`](supabase/schema.sql).

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## ☁️ Deployment (Vercel)

1. Push to GitHub.
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Add the environment variables from the table above.
4. Deploy — Vercel auto-detects Next.js.

## 🤖 AI Recommendation Logic

The rules engine decides **which** credential by scoring each pathway:

- **Certification Program** — low experience or an upskilling / career-switch goal.
- **DBA** — 5+ years experience and a business / management / executive goal.
- **PhD** — Master's+ qualification and a research / academic goal.
- **Honorary Doctorate** — 15+ years experience and a recognition / thought-leadership goal.

OpenRouter then writes the personalised prose explanation around that decision. This split keeps the recommendation deterministic and free while still showcasing AI.
