# ImplFlow

**Turn messy customer onboarding notes into a launch-ready implementation plan — in minutes, not hours.**

ImplFlow is an internal operations tool for **implementation managers**. Paste the messy notes from a customer kickoff call, and it produces a structured implementation plan: a customer summary, a missing-information checklist, a blocker/risk list, a task board, a setup-completeness score, and an estimate of the manual review time saved.

<br>

## Why I built this (for Built's recruiting team)

I built ImplFlow as a small internal-tooling prototype inspired by Built's **Software Engineer I – Internal Tooling** role. Built's job post stood out to me because it focuses on helping the implementation team move faster through automations, workflows, and practical AI-assisted tools — the team is growing faster than headcount, and manual onboarding work is a real bottleneck for Time-to-Value.

ImplFlow turns messy customer onboarding notes into a structured implementation plan with missing information, blockers, generated tasks, completeness scoring, and estimated time saved. I built it to show how I'd approach the role at Built: **understand a real operational bottleneck, ship a useful internal tool quickly, and measure whether it reduces manual implementation work.**

The domain is modeled directly on Built's business — construction-loan **draw management**: lenders, owners, and contractors; draw requests with invoices and lien waivers; inspection-gated funding; budget imports; approval workflows by loan type; and role-based access.

<br>

## How it maps to the role

| The role is about… | ImplFlow demonstrates… |
| --- | --- |
| Reducing manual work for the implementation team | Auto-generates the plan an IM would otherwise build by hand |
| Automations & AI-assisted internal tools | Deterministic rules engine **+** optional LLM analysis |
| Improving Time-to-Value | Surfaces blockers and missing info *before* they delay launch |
| Ownership & working from ambiguity | Built end-to-end from a vague operational problem |
| Measurable business outcomes | Completeness score, blocker count, and time-saved metric |

<br>

## Demo flow

1. Open the **dashboard** — see existing customer implementations, their completeness, blockers, and status.
2. Click **New Intake**.
3. Click **Load sample** to drop in a realistic (messy) kickoff-call note — or paste your own.
4. Click **Analyze Intake**.
5. ImplFlow generates a customer summary, missing-info checklist, blocker/risk list, task board, and metrics.
6. Check off missing items and move tasks across the board — the completeness score updates live.
7. Everything is saved locally and appears back on the dashboard.

<br>

## How the analysis works

The core is a single pure function, `analyzeIntake()` (`lib/analyze.ts`), that maps phrases in the notes to concrete plan items using deterministic rules. It's **AI-ready but not AI-dependent**:

- **Rules engine (default):** deterministic keyword matching. Always works, offline, and produces identical output for the sample data every time — so the demo never breaks.
- **AI mode (optional):** if `OPENAI_API_KEY` is set, `POST /api/analyze` uses the OpenAI API to generate the plan, with **graceful fallback** to the rules engine on any error (no key, network failure, or malformed output).

<br>

## Tech stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS** + custom shadcn-style UI components + **Lucide** icons
- **Zustand** (with `localStorage` persistence) for client state
- **OpenAI API** (optional) for the AI analysis path, behind a serverless route

<br>

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

To enable the AI path, copy `.env.example` to `.env.local` and set `OPENAI_API_KEY`. Without a key, ImplFlow runs entirely on the deterministic rules engine.

### Deploy

Deploys to **Vercel** as-is. Set `OPENAI_API_KEY` in the Vercel project settings to enable AI mode; the dashboard ships with three seeded demo projects so a first-time visitor lands on a populated app.

<br>

## Future improvements

- Real LLM extraction with structured-output guarantees and confidence scores
- CSV / PDF upload parsing for budget files
- Jira / Linear task export and Slack alerts for high-priority blockers
- Postgres/Supabase persistence and multi-user workspaces
- A Time-to-Value analytics dashboard across all implementations
# built-repo
