# ImplFlow PRD — Built-Inspired Internal Implementation Automation Tool

## 1. Product Summary

**Product name:** ImplFlow  
**One-liner:** An internal implementation tool that turns messy customer onboarding notes, CSVs, and setup requirements into a clean implementation checklist, blocker list, and task board.

ImplFlow is inspired by Built's internal tooling role: helping implementation teams move faster by automating repetitive setup work. The product is not customer-facing. It is an internal operations tool for implementation managers who onboard new lenders, owners, contractors, or developers onto a real estate/construction finance platform.

The demo should prove one thing clearly: **given messy onboarding information, ImplFlow helps an implementation team understand what needs to be configured, what is missing, what is blocked, and what to do next.**


---

## Recruiter Attention Strategy — Why We Are Building This

This prototype is being built specifically to capture attention from Built's recruiting and engineering team by showing, not just saying, that I understand the Software Engineer I - Internal Tooling role. Built's job post says the implementation team is growing faster than headcount and needs internal tools, automations, workflows, and AI-assisted systems that reduce manual work and improve Time-to-Value. ImplFlow directly mirrors that pain point.

The goal is not to build a generic AI app. The goal is to build something that feels like it could be used inside Built by an implementation manager tomorrow: paste messy onboarding notes, identify what is missing, generate blockers, create tasks, and measure time saved. This shows the exact instincts Built is hiring for: ownership, speed, ambiguity, practical automation, full-stack execution, and business curiosity.

When shared with a recruiter or hiring manager, ImplFlow should communicate three things quickly:

1. I researched Built's business and understood that implementation speed matters.
2. I can turn a vague operational problem into a working internal tool without needing a detailed spec.
3. I care about measurable business outcomes like fewer manual hours, fewer blockers, and faster customer onboarding.

This should be included in the README and recruiter message so the project is framed correctly. The message should be: **I built this because the role is about reducing manual implementation work, and I wanted to show how I would approach that problem at Built.**


## 2. Target User

### Primary User
**Implementation Manager / Implementation Specialist**

This person receives customer onboarding information through emails, spreadsheets, PDFs, sales notes, kickoff call notes, and manual forms. Their job is to translate that messy information into platform setup tasks.

### User Goals
- Understand the customer setup quickly
- Identify missing or unclear information
- Create a task list for implementation work
- Track blockers before launch
- Reduce time spent manually reviewing onboarding docs

---

## 3. Problem Statement

Implementation teams often receive customer onboarding data in messy formats: call notes, CSVs, spreadsheets, pasted requirements, and incomplete setup forms. Manually reviewing this information takes time and creates risk because important setup details can be missed.

For a real estate finance/construction platform, missing details like approval rules, budget columns, user roles, draw workflow settings, inspection requirements, or payment configuration can delay customer launch and increase Time-to-Value.

ImplFlow solves this by converting messy onboarding input into a structured implementation plan.

---

## 4. Core Value Proposition

ImplFlow helps implementation teams go from **messy onboarding input** to **clear execution plan** in minutes.

It should generate:
1. Customer setup summary
2. Missing information checklist
3. Implementation task board
4. Blocker/risk detection
5. Setup completeness score
6. Estimated manual review time saved

---

## 5. MVP Scope — Build in 1 Hour

The MVP must be small, polished, and demoable. Do not overbuild authentication, real file storage, or complex backend workflows unless time remains.

### Must Have
- Landing/dashboard page
- New implementation intake form
- Text area for messy onboarding notes
- Optional CSV paste/upload mock
- “Analyze Intake” button
- AI/rule-based generated output
- Customer summary card
- Missing info checklist
- Task board with statuses
- Risk/blocker panel
- Completeness score
- Time saved estimate
- Clean UI that looks like a real internal SaaS tool

### Nice to Have
- Save projects locally or in database
- Export checklist as markdown
- Drag-and-drop task status
- Sample data button
- Activity timeline
- Dark mode

### Do Not Build
- Real authentication
- Real payment processing
- Real external integrations
- Complex document parsing
- Multi-tenant admin panel
- Production-grade permissions

---

## 6. Demo Story

The demo should follow this flow:

1. User opens ImplFlow dashboard.
2. User sees existing customer implementation projects and their statuses.
3. User clicks **New Intake**.
4. User pastes messy onboarding notes from a fake customer kickoff call.
5. User clicks **Analyze Intake**.
6. ImplFlow generates:
   - customer summary
   - missing fields
   - blockers
   - implementation tasks
   - setup completeness score
7. User reviews task board and blocker list.
8. User exports or copies implementation checklist.

The viewer should immediately understand: **this saves implementation managers from manually reading messy notes and building setup plans from scratch.**

---

## 7. Sample Input for Demo

Use this as the built-in sample data:

```text
Customer: Riverstone Community Bank
Customer Type: Regional lender
Primary Use Case: Construction loan draw management for commercial and residential projects

Kickoff Notes:
Riverstone wants to onboard 42 active construction loans into the platform. They currently manage draw requests through email, Excel budget sheets, and manual inspection follow-ups. Their team wants borrowers to submit draw requests with invoices and lien waivers attached. They need two approval paths: one for consumer loans and one for commercial loans.

Commercial draws require inspection approval before funding. Consumer draws may be approved by loan officers without inspection if the draw amount is under $25,000. They use an external inspection vendor but the vendor contact was not provided. Payment approval rules are still unclear. Budget files are available, but some files are missing project IDs and contractor emails.

Required fields mentioned:
- Loan ID
- Borrower name
- Project address
- Contractor email
- Budget line items
- Draw amount
- Inspection status
- Lien waiver required
- Invoice attachments

Known concerns:
- Some budget spreadsheets have inconsistent column names
- Approval rules are different by loan type
- Need reporting for draw turnaround time
- Need user roles for loan officer, admin, inspector, and borrower
```

---

## 8. Expected AI/Rules Output

### Customer Summary
```text
Riverstone Community Bank is onboarding 42 active construction loans for commercial and residential draw management. Their current process relies on email, Excel budget sheets, and manual inspection follow-ups. They need borrower-submitted draw requests with invoices and lien waivers, separate approval workflows by loan type, inspection handling, reporting, and role-based access.
```

### Missing Information Checklist
- Inspection vendor contact is missing
- Payment approval rules are unclear
- Some budget files are missing project IDs
- Some budget files are missing contractor emails
- Final user role permissions are not fully defined
- Reporting requirements need confirmation

### Blockers / Risks
- **High:** Payment approval rules are unclear and may block launch
- **High:** Missing project IDs can prevent clean loan import
- **Medium:** Inconsistent budget column names may require manual cleanup
- **Medium:** Inspection vendor details are missing
- **Low:** Reporting requirements need more detail

### Implementation Tasks
| Task | Category | Status | Priority |
|---|---|---|---|
| Import 42 active construction loans | Data Import | Not Started | High |
| Normalize budget spreadsheet columns | Data Cleanup | Not Started | High |
| Configure commercial draw approval workflow | Workflow Setup | Not Started | High |
| Configure consumer draw approval workflow | Workflow Setup | Not Started | High |
| Add lien waiver and invoice attachment requirements | Document Setup | Not Started | Medium |
| Confirm payment approval rules | Customer Follow-up | Blocked | High |
| Collect inspection vendor contact | Customer Follow-up | Blocked | Medium |
| Define user roles and permissions | Access Control | Not Started | Medium |
| Set up draw turnaround reporting | Reporting | Not Started | Low |

### Metrics
- Setup completeness: 68%
- Estimated manual review time saved: 45 minutes
- Blockers found: 2 high priority, 2 medium priority
- Generated tasks: 9

---

## 9. UI Requirements

### Visual Style
The UI should feel like a modern internal SaaS dashboard:
- Clean white background
- Soft gray panels
- Blue/indigo accent color
- Rounded cards
- Professional spacing
- No playful consumer-app styling
- Dense enough to feel operational, but not cluttered

### Recommended UI Components
Use shadcn/ui or similar components:
- Card
- Button
- Textarea
- Badge
- Progress
- Tabs
- Table
- Select
- Input
- Separator
- ScrollArea

### Main Pages

#### Page 1: Dashboard
Route: `/`

Sections:
- Header: “ImplFlow” + subtitle “Implementation intake automation”
- KPI cards:
  - Active implementations
  - Avg completeness
  - Blockers detected
  - Hours saved
- Recent implementation projects table
- Button: “New Intake”

Example project rows:
- Riverstone Community Bank — 68% complete — 4 blockers — In Progress
- HarborPoint Lending — 84% complete — 1 blocker — In Review
- Mason Ridge Developers — 51% complete — 6 blockers — Needs Info

#### Page 2: New Intake / Analyzer
Can be same page with tabs or route `/intake`.

Left side:
- Customer name input
- Customer type select
- Messy notes textarea
- Sample data button
- Analyze Intake button

Right side after analysis:
- Customer summary card
- Completeness score card
- Missing information checklist
- Blockers panel
- Task board/table

#### Page 3: Task Board Section
Can be inside analyzer page.

Columns:
- Not Started
- Blocked
- In Progress
- Ready for Review

For MVP, a table is okay. Drag-and-drop is optional.

---

## 10. Functional Requirements

### FR1: User can paste intake notes
The user can paste messy onboarding notes into a textarea.

Acceptance Criteria:
- Textarea accepts long text
- Empty state shows helpful placeholder
- Sample data button populates realistic demo notes

### FR2: User can analyze intake
The user clicks “Analyze Intake” and receives structured output.

Acceptance Criteria:
- Button shows loading state for 1–2 seconds
- Output includes summary, missing info, blockers, tasks, metrics
- Works even without real AI by using deterministic mock/rules

### FR3: App generates implementation checklist
The app creates missing information checklist items.

Acceptance Criteria:
- Checklist has at least 5 items for sample data
- Each item can be checked/unchecked locally
- Missing items are written in plain business language

### FR4: App generates blockers/risks
The app displays risks with severity.

Acceptance Criteria:
- Risks have severity: High, Medium, Low
- Risks are visually highlighted with badges
- High-risk blockers are easy to notice

### FR5: App generates implementation tasks
The app generates tasks from the intake notes.

Acceptance Criteria:
- Tasks include title, category, status, priority
- User can change task status locally
- Tasks are grouped or sortable by status/priority

### FR6: App shows measurable impact
The app calculates basic metrics.

Acceptance Criteria:
- Completeness score shown as percent
- Manual review time saved shown in minutes
- Number of blockers shown
- Number of generated tasks shown

---

## 11. Non-Functional Requirements

- App should load quickly
- UI should look polished on laptop screen
- Must be responsive enough for demo
- No crashes on empty input
- Output should be deterministic for sample data
- Code should be clean and easy to explain
- Keep implementation simple and production-looking, not production-complete

---

## 12. Suggested Tech Stack

Fastest path:
- **Next.js App Router**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Lucide icons**
- **Local state only** for MVP

Optional if time:
- PostgreSQL / Supabase
- OpenAI API route
- Prisma

For a 1-hour build, prefer mock AI analysis with clean deterministic parsing. You can describe it as AI-ready and include an API route stub.

---

## 13. Data Model

### ImplementationProject
```ts
type ImplementationProject = {
  id: string;
  customerName: string;
  customerType: 'Bank' | 'Private Credit' | 'Owner/Developer' | 'General Contractor';
  status: 'Needs Info' | 'In Progress' | 'In Review' | 'Ready';
  completenessScore: number;
  blockersCount: number;
  createdAt: string;
  summary: string;
  missingInfo: MissingInfoItem[];
  risks: RiskItem[];
  tasks: ImplementationTask[];
};
```

### MissingInfoItem
```ts
type MissingInfoItem = {
  id: string;
  text: string;
  completed: boolean;
};
```

### RiskItem
```ts
type RiskItem = {
  id: string;
  title: string;
  severity: 'High' | 'Medium' | 'Low';
  description: string;
};
```

### ImplementationTask
```ts
type ImplementationTask = {
  id: string;
  title: string;
  category: 'Data Import' | 'Data Cleanup' | 'Workflow Setup' | 'Document Setup' | 'Customer Follow-up' | 'Access Control' | 'Reporting';
  status: 'Not Started' | 'Blocked' | 'In Progress' | 'Ready for Review';
  priority: 'High' | 'Medium' | 'Low';
};
```

---

## 14. Analysis Logic

For MVP, implement a function:

```ts
function analyzeIntake(notes: string, customerName: string, customerType: string): ImplementationProject
```

The function can use keyword/rule matching.

### Rule Examples
- If notes include “vendor contact was not provided” → missing inspection vendor contact
- If notes include “payment approval rules are unclear” → high-risk blocker
- If notes include “missing project IDs” → high-risk blocker + data cleanup task
- If notes include “contractor emails” → missing info item
- If notes include “approval paths” → workflow setup tasks
- If notes include “lien waiver” → document setup task
- If notes include “reporting” → reporting task
- If notes include “user roles” → access control task

Always generate reasonable output even when rules do not match.

---

## 15. Copywriting

### App Header
**ImplFlow**  
Turn messy onboarding notes into a launch-ready implementation plan.

### Empty State
Paste kickoff notes, onboarding requirements, or messy customer setup details. ImplFlow will extract missing information, blockers, tasks, and a setup completeness score.

### Analyze Button
Analyze Intake

### Results Header
Implementation Plan

### Metric Labels
- Setup Completeness
- Manual Review Time Saved
- Blockers Found
- Tasks Generated

---

## 16. How to Pitch This to Built

Use this explanation in README or recruiter message:

```text
I built ImplFlow as a small internal tooling prototype inspired by Built's Software Engineer I - Internal Tooling role. Built's job post stood out to me because it focuses on helping the implementation team move faster through automations, workflows, and practical AI-assisted tools. ImplFlow turns messy customer onboarding notes into a structured implementation plan with missing information, blockers, generated tasks, completeness scoring, and estimated time saved. I built it to show how I would approach the role at Built: understand a real operational bottleneck, ship a useful internal tool quickly, and measure whether it reduces manual implementation work.
```

### Short LinkedIn Message to Recruiter

```text
Hi [Name], I applied for Built's Software Engineer I - Internal Tooling role and built a small prototype called ImplFlow inspired by the role. It takes messy implementation onboarding notes, flags missing information and blockers, and generates a launch-ready task plan with a completeness score and estimated time saved. I built it to show how I would approach the role: find an operational bottleneck, ship a practical internal tool quickly, and measure whether it reduces manual work.
```

---

## 17. README Requirements

The generated project should include a README with:

- What ImplFlow does
- Why it was built specifically for Built
- How it maps to the Software Engineer I - Internal Tooling role
- Why it is relevant to implementation/internal tooling
- Demo flow
- Tech stack
- How to run locally
- Recruiter pitch message
- Future improvements

### README Quickstart
```bash
npm install
npm run dev
```

---

## 18. Future Improvements

- Real LLM extraction using OpenAI/Claude
- CSV and PDF upload parsing
- Jira/Linear task export
- Slack notification for high-priority blockers
- Customer implementation timeline
- Role-based permissions
- Supabase/PostgreSQL persistence
- Analytics dashboard for Time-to-Value impact

---

## 19. Build Priority Order

If using Claude/Cursor, build in this order:

1. Next.js project with polished dashboard shell
2. Sample data and mock projects
3. Intake form with sample data button
4. Analyze function with deterministic output
5. Results cards: summary, metrics, missing info, blockers
6. Task table/board
7. README and recruiter pitch
8. Optional: local storage persistence
9. Optional: export checklist

---

## 20. Final Acceptance Criteria

The prototype is successful if someone can understand it in under 30 seconds:

- It is clearly an internal tool
- It clearly targets implementation workflow pain
- It converts messy notes into structured tasks
- It shows blockers and missing info
- It includes measurable impact
- It looks polished enough to send to a recruiter

