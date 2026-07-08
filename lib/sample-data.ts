import type { ImplementationProject } from "./types";

/** Built-in demo notes — populates the intake textarea via "Load sample". */
export const SAMPLE_NOTES = `Customer: Riverstone Community Bank
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
- Need user roles for loan officer, admin, inspector, and borrower`;

/**
 * Statically-authored seed projects so the dashboard is populated on first load
 * (important for a hosted demo a recruiter opens fresh). The Riverstone plan
 * mirrors exactly what analyzeIntake() produces for SAMPLE_NOTES.
 */
export const SEED_PROJECTS: ImplementationProject[] = [
  {
    id: "seed-riverstone",
    customerName: "Riverstone Community Bank",
    customerType: "Bank",
    status: "In Progress",
    completenessScore: 68,
    blockersCount: 4,
    timeSavedMinutes: 45,
    createdAt: "2026-07-06T15:20:00.000Z",
    engine: "rules",
    summary:
      "Riverstone Community Bank (Bank) is onboarding 42 active construction loans for commercial and residential draw management. Their current process relies on email, Excel budget sheets, and manual inspection follow-ups. They need borrower-submitted draw requests with invoices and lien waivers, separate approval workflows by loan type, inspection handling, reporting, and role-based access.",
    missingInfo: [
      { id: "rv-m1", text: "Inspection vendor contact is missing", completed: false },
      { id: "rv-m2", text: "Payment approval rules are unclear", completed: false },
      { id: "rv-m3", text: "Some budget files are missing project IDs", completed: false },
      { id: "rv-m4", text: "Some budget files are missing contractor emails", completed: false },
      { id: "rv-m5", text: "Final user role permissions are not fully defined", completed: false },
      { id: "rv-m6", text: "Reporting requirements need confirmation", completed: false },
    ],
    risks: [
      {
        id: "rv-r1",
        title: "Payment approval rules are unclear",
        severity: "High",
        description: "Undefined payment approval rules can block funding and delay launch.",
      },
      {
        id: "rv-r2",
        title: "Missing project IDs can prevent clean loan import",
        severity: "High",
        description: "Budget files without project IDs cannot be matched to loans during import.",
      },
      {
        id: "rv-r3",
        title: "Inconsistent budget column names may require manual cleanup",
        severity: "Medium",
        description: "Spreadsheets with inconsistent column names need normalization before import.",
      },
      {
        id: "rv-r4",
        title: "Inspection vendor details are missing",
        severity: "Medium",
        description: "Commercial draws require inspection approval, but no vendor contact was provided.",
      },
    ],
    tasks: [
      { id: "rv-t1", title: "Import 42 active construction loans", category: "Data Import", status: "Not Started", priority: "High" },
      { id: "rv-t2", title: "Configure commercial draw approval workflow", category: "Workflow Setup", status: "Not Started", priority: "High" },
      { id: "rv-t3", title: "Configure consumer draw approval workflow", category: "Workflow Setup", status: "Not Started", priority: "High" },
      { id: "rv-t4", title: "Collect inspection vendor contact", category: "Customer Follow-up", status: "Blocked", priority: "Medium" },
      { id: "rv-t5", title: "Confirm payment approval rules", category: "Customer Follow-up", status: "Blocked", priority: "High" },
      { id: "rv-t6", title: "Normalize budget spreadsheet columns", category: "Data Cleanup", status: "Not Started", priority: "High" },
      { id: "rv-t7", title: "Add lien waiver and invoice attachment requirements", category: "Document Setup", status: "Not Started", priority: "Medium" },
      { id: "rv-t8", title: "Define user roles and permissions", category: "Access Control", status: "Not Started", priority: "Medium" },
      { id: "rv-t9", title: "Set up draw turnaround reporting", category: "Reporting", status: "Not Started", priority: "Low" },
    ],
  },
  {
    id: "seed-harborpoint",
    customerName: "HarborPoint Lending",
    customerType: "Private Credit",
    status: "In Review",
    completenessScore: 85,
    blockersCount: 1,
    timeSavedMinutes: 35,
    createdAt: "2026-07-07T18:05:00.000Z",
    engine: "rules",
    summary:
      "HarborPoint Lending (Private Credit) is onboarding 18 commercial construction loans. Data is clean and largely complete; a single approval-routing question remains before launch.",
    missingInfo: [
      { id: "hp-m1", text: "Confirm escalation contact for draws over $500K", completed: false },
      { id: "hp-m2", text: "Confirm reporting cadence (weekly vs. monthly)", completed: true },
      { id: "hp-m3", text: "Final sign-off on notification templates", completed: false },
    ],
    risks: [
      {
        id: "hp-r1",
        title: "High-value draw approval routing is undefined",
        severity: "High",
        description: "Draws over $500K have no designated approver, which could stall large disbursements.",
      },
    ],
    tasks: [
      { id: "hp-t1", title: "Import 18 commercial construction loans", category: "Data Import", status: "Ready for Review", priority: "High" },
      { id: "hp-t2", title: "Configure commercial draw approval workflow", category: "Workflow Setup", status: "In Progress", priority: "High" },
      { id: "hp-t3", title: "Set high-value draw escalation approver", category: "Customer Follow-up", status: "Blocked", priority: "High" },
      { id: "hp-t4", title: "Add invoice attachment requirements", category: "Document Setup", status: "Ready for Review", priority: "Medium" },
      { id: "hp-t5", title: "Define user roles and permissions", category: "Access Control", status: "Ready for Review", priority: "Medium" },
      { id: "hp-t6", title: "Set up draw turnaround reporting", category: "Reporting", status: "In Progress", priority: "Low" },
      { id: "hp-t7", title: "Configure borrower notification templates", category: "Workflow Setup", status: "In Progress", priority: "Low" },
    ],
  },
  {
    id: "seed-masonridge",
    customerName: "Mason Ridge Developers",
    customerType: "Owner/Developer",
    status: "Needs Info",
    completenessScore: 50,
    blockersCount: 6,
    timeSavedMinutes: 45,
    createdAt: "2026-07-08T13:40:00.000Z",
    engine: "rules",
    summary:
      "Mason Ridge Developers (Owner/Developer) is onboarding a multi-project portfolio with significant data gaps. Multiple approval, inspection, and data-quality items must be resolved before setup can proceed.",
    missingInfo: [
      { id: "mr-m1", text: "Complete project list with addresses is missing", completed: false },
      { id: "mr-m2", text: "Draw approval hierarchy is undefined", completed: false },
      { id: "mr-m3", text: "Inspection vendor contact is missing", completed: false },
      { id: "mr-m4", text: "Budget files are missing project IDs", completed: false },
      { id: "mr-m5", text: "Contractor emails not provided", completed: false },
      { id: "mr-m6", text: "Lender-of-record details need confirmation", completed: false },
      { id: "mr-m7", text: "User role list is incomplete", completed: false },
      { id: "mr-m8", text: "Retainage rules not documented", completed: false },
      { id: "mr-m9", text: "Reporting requirements need confirmation", completed: false },
    ],
    risks: [
      { id: "mr-r1", title: "Draw approval hierarchy is undefined", severity: "High", description: "No approval chain means draws cannot be routed or funded." },
      { id: "mr-r2", title: "Missing project IDs can prevent clean loan import", severity: "High", description: "Budget files without project IDs cannot be matched to projects." },
      { id: "mr-r3", title: "Incomplete project list blocks setup", severity: "High", description: "The full project list is required before any configuration." },
      { id: "mr-r4", title: "Lender-of-record is unconfirmed", severity: "High", description: "Funding cannot be configured without a confirmed lender of record." },
      { id: "mr-r5", title: "Inspection vendor details are missing", severity: "Medium", description: "Inspection-gated draws cannot be set up without a vendor contact." },
      { id: "mr-r6", title: "Retainage rules are undocumented", severity: "Medium", description: "Retainage handling affects disbursement math and must be defined." },
    ],
    tasks: [
      { id: "mr-t1", title: "Collect complete project list and addresses", category: "Customer Follow-up", status: "Blocked", priority: "High" },
      { id: "mr-t2", title: "Define draw approval hierarchy", category: "Workflow Setup", status: "Blocked", priority: "High" },
      { id: "mr-t3", title: "Normalize budget spreadsheet columns", category: "Data Cleanup", status: "Not Started", priority: "High" },
      { id: "mr-t4", title: "Collect inspection vendor contact", category: "Customer Follow-up", status: "Blocked", priority: "Medium" },
      { id: "mr-t5", title: "Confirm lender of record", category: "Customer Follow-up", status: "Blocked", priority: "High" },
      { id: "mr-t6", title: "Document retainage rules", category: "Workflow Setup", status: "Not Started", priority: "Medium" },
      { id: "mr-t7", title: "Define user roles and permissions", category: "Access Control", status: "Not Started", priority: "Medium" },
      { id: "mr-t8", title: "Import project and budget data", category: "Data Import", status: "Not Started", priority: "High" },
      { id: "mr-t9", title: "Set up portfolio reporting", category: "Reporting", status: "Not Started", priority: "Low" },
    ],
  },
];
