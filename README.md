# Academic Pathway Recommendation Engine

**Live demo:** [academic-pathway-recommendation-eng.vercel.app](https://academic-pathway-recommendation-eng.vercel.app)

A web app that takes a person's profile — qualification, work experience, profession and career goal — and recommends the academic credential that fits them best: a **Certification Program**, **DBA**, **PhD**, or **Honorary Doctorate**. Every submission is stored in Supabase with its recommendation and timestamp, and an admin dashboard at [`/submissions`](https://academic-pathway-recommendation-eng.vercel.app/submissions) shows everything that has come through.

Built for the Acdyon Technical Internship Challenge.

## What it does

- **Profile form** collecting full name, email, highest qualification, years of experience, current profession and career goal, with validation and loading states.
- **Two-stage recommendation engine** (see below) that picks a pathway and writes a personalised explanation for it.
- **Email notification** — the user gets their recommendation and submitted details in their inbox (via Resend).
- **Admin dashboard** at `/submissions` with per-pathway stats, live search, filtering by recommendation, CSV export, and date + time for every entry. No login required, per the brief.
- Mobile-responsive throughout, with skeleton loaders, graceful error handling and Vercel Analytics.

## How the recommendation works

I split the engine into two stages on purpose:

1. **A rules engine decides *which* credential** ([`src/lib/recommend.ts`](src/lib/recommend.ts)). Each pathway gets a score from qualification rank, years of experience, and keyword signals in the profession and career goal — e.g. 15+ years plus a recognition-oriented goal points to an Honorary Doctorate, while a research goal with a Master's points to a PhD. Deterministic, instant, free, and easy to reason about.
2. **An LLM writes *why*** ([`src/lib/ai.ts`](src/lib/ai.ts)). A free OpenRouter model turns the decision into a warm, personalised explanation. If a model is rate-limited it falls through a chain of free models, and if all of them fail the rules engine's own explanation is used — so the app never breaks because of a third-party API.

This split keeps the actual recommendation reliable and testable, while the AI handles what it's genuinely good at: the writing.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS |
| Database | Supabase (Postgres) |
| AI | OpenRouter free models, with fallback chain |
| Email | Resend |
| Analytics | Vercel Web Analytics |
| Hosting | Vercel |

## Architecture

```
Browser ──▶ / (profile form)
              │  POST /api/submit
              ▼
        src/app/api/submit/route.ts
        1. validate input
        2. getRecommendation()   ← rules engine picks the pathway
        3. generateExplanation() ← OpenRouter writes the rationale
        4. insert into Supabase
        5. sendRecommendationEmail() ← Resend
              │
              ▼
        Supabase `submissions` table
              ▲
              │  server-side fetch
        /submissions (stats · search · filter · CSV export)
```

## Database design

One `submissions` table ([`supabase/schema.sql`](supabase/schema.sql)):

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | primary key, generated |
| `name`, `email` | text | applicant identity |
| `qualification`, `experience`, `profession`, `career_goal` | text | profile inputs |
| `recommendation` | text | the chosen pathway |
| `recommendation_reason` | text | the personalised explanation |
| `created_at` | timestamptz | defaults to `now()` |

Row Level Security is enabled with policies allowing anonymous insert and select only — the public key can write submissions and read the dashboard, but can't update or delete anything.

## Running locally

```bash
npm install
cp .env.example .env.local   # fill in your values
npm run dev
```

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | Supabase publishable key |
| `OPENROUTER_API_KEY` | no | AI explanations (falls back to rules text without it) |
| `RESEND_API_KEY` | no | recommendation emails (skipped without it) |
| `EMAIL_FROM` | no | sender address |

Create the table by running [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL editor, then open [http://localhost:3000](http://localhost:3000).

## Deployment

Deployed on Vercel: import the GitHub repo, add the environment variables above, deploy. Every push to `main` redeploys automatically.

## Challenges I ran into

- **Free-model churn.** The OpenRouter free tier changes constantly — model IDs I expected to work were no longer free, and live ones get rate-limited in bursts. I solved it with a verified fallback chain plus a final rules-based fallback, so a submission always succeeds.
- **Recommendation edge cases.** An early version scored a 20-year founder seeking "thought leadership" as DBA instead of Honorary Doctorate, because the word *leadership* matched a business keyword. Fixing it meant treating recognition language as its own signal rather than letting it overlap with business terms.
- **Email on a free tier.** Resend's sandbox sender only delivers to the account owner's address until a domain is verified, so email sending is built to no-op gracefully instead of failing the whole submission.
