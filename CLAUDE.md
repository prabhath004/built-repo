# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Current State

This repo currently contains **only the PRD** (`implflow_prd(1).md`) — no code has been scaffolded yet. The PRD is the authoritative spec. When building, follow its **Build Priority Order** (PRD §19) and respect its **Do Not Build** list (PRD §5): no real auth, payments, external integrations, document parsing, multi-tenancy, or production permissions.

## What ImplFlow Is

An internal implementation-automation tool (not customer-facing) that turns messy customer onboarding notes into a structured implementation plan: customer summary, missing-info checklist, blocker/risk list, task board, completeness score, and estimated time saved. Built as a portfolio prototype targeting Built's "Software Engineer I – Internal Tooling" role — polish and a clear demo story matter as much as functionality (PRD §16, §20).

## Intended Tech Stack (PRD §12)

Next.js App Router + TypeScript + Tailwind CSS + shadcn/ui + Lucide icons. **Local state only** for the MVP — no database. AI analysis is **mocked with deterministic rules**, not a real LLM call; keep it AI-ready (an API route stub is fine) but the demo must produce identical output for the sample data every time.

## Commands

Not yet established. Once scaffolded with `create-next-app`, expect the standard: `npm install`, `npm run dev`, `npm run build`, `npm run lint`. Update this section with the real commands (and how to run a single test, if tests are added) after scaffolding.

## Architecture

The whole app hinges on one pure function (PRD §14):

```ts
function analyzeIntake(notes: string, customerName: string, customerType: string): ImplementationProject
```

This is the core of the product. Everything else is UI that renders its output. Key design constraints:

- **Deterministic keyword/rule matching**, not AI. Specific phrases in the notes map to specific outputs (see PRD §14 rule examples: "vendor contact was not provided" → missing-info item; "payment approval rules are unclear" → high-severity blocker; "missing project IDs" → blocker + cleanup task; etc.).
- **Must always return reasonable output**, even when no rules match and even on empty input (no crashes — PRD §11).
- The built-in **sample data** (PRD §7) must produce the **exact expected output** in PRD §8 (68% completeness, ~45 min saved, 9 tasks, 2 high + 2 medium blockers). This is the demo; treat those numbers as a fixture to match.

The data model is fully specified in PRD §13 (`ImplementationProject`, `MissingInfoItem`, `RiskItem`, `ImplementationTask`) with exact union types for `customerType`, `status`, task `category`, `priority`, and risk `severity`. Use these types verbatim.

### Pages (PRD §9)
- `/` — Dashboard: header, 4 KPI cards (active implementations, avg completeness, blockers detected, hours saved), recent-projects table, "New Intake" button. Seed with the three example rows (Riverstone, HarborPoint, Mason Ridge).
- `/intake` (or a tab on `/`) — Analyzer: left = customer name/type inputs + notes textarea + sample-data button + Analyze button; right (post-analysis) = summary card, completeness card, missing-info checklist, blockers panel, task board/table.
- Task board columns: Not Started / Blocked / In Progress / Ready for Review. A table is acceptable for MVP; drag-and-drop is optional.

## UX Guardrails (PRD §9, §10, §15)

- Visual tone: modern internal SaaS — white background, soft gray panels, blue/indigo accent, rounded cards, dense-but-clean. **Not** playful/consumer styling.
- "Analyze Intake" should show a 1–2s loading state before rendering results (sells the "AI" feel).
- Checklist items, task statuses, and metrics are locally mutable (checkboxes, status changes).
- Copy is fixed in PRD §15 — use it verbatim (header tagline, empty state, metric labels).

## Deliverable Beyond Code

A README is a first-class deliverable (PRD §17): what ImplFlow does, why it maps to the Built role, demo flow, tech stack, how to run, and the recruiter pitch (copy provided verbatim in PRD §16). Don't skip it.
