import type {
  CustomerType,
  ImplementationProject,
  ImplementationTask,
  MissingInfoItem,
  Priority,
  ProjectStatus,
  RiskItem,
  Severity,
  TaskCategory,
} from "./types";

/**
 * The core of ImplFlow.
 *
 * `analyzeIntake` turns messy onboarding notes into a structured implementation
 * plan using deterministic keyword/rule matching. It is intentionally pure and
 * deterministic: the same notes always produce the same plan, which is what
 * makes the demo reliable and offline-safe.
 *
 * The optional AI path (see app/api/analyze) layers an LLM on top of this, but
 * this function is always the guaranteed fallback.
 */

interface Rule {
  /** phrases that trigger this rule (case-insensitive, matched against notes) */
  match: string[];
  missing?: string;
  risk?: Omit<RiskItem, "id">;
  task?: Omit<ImplementationTask, "id">;
}

/**
 * Ordered rule set. Order matters only for display; each rule fires at most once.
 * Designed so the built-in Riverstone sample reproduces the PRD's expected
 * output exactly (9 tasks, 6 missing-info items, 2 high + 2 medium blockers,
 * 68% completeness, 45 min saved).
 */
const RULES: Rule[] = [
  {
    match: ["vendor contact was not provided", "inspection vendor"],
    missing: "Inspection vendor contact is missing",
    risk: {
      title: "Inspection vendor details are missing",
      severity: "Medium",
      description:
        "Commercial draws require inspection approval, but no vendor contact was provided.",
    },
    task: {
      title: "Collect inspection vendor contact",
      category: "Customer Follow-up",
      status: "Blocked",
      priority: "Medium",
    },
  },
  {
    match: ["payment approval rules are still unclear", "payment approval rules are unclear", "payment approval"],
    missing: "Payment approval rules are unclear",
    risk: {
      title: "Payment approval rules are unclear",
      severity: "High",
      description:
        "Undefined payment approval rules can block funding and delay launch.",
    },
    task: {
      title: "Confirm payment approval rules",
      category: "Customer Follow-up",
      status: "Blocked",
      priority: "High",
    },
  },
  {
    match: ["missing project id", "missing project ids"],
    missing: "Some budget files are missing project IDs",
    risk: {
      title: "Missing project IDs can prevent clean loan import",
      severity: "High",
      description:
        "Budget files without project IDs cannot be matched to loans during import.",
    },
  },
  {
    match: ["contractor email"],
    missing: "Some budget files are missing contractor emails",
  },
  {
    match: ["inconsistent column", "inconsistent budget", "column names"],
    risk: {
      title: "Inconsistent budget column names may require manual cleanup",
      severity: "Medium",
      description:
        "Spreadsheets with inconsistent column names need normalization before import.",
    },
    task: {
      title: "Normalize budget spreadsheet columns",
      category: "Data Cleanup",
      status: "Not Started",
      priority: "High",
    },
  },
  {
    match: ["lien waiver", "invoice"],
    task: {
      title: "Add lien waiver and invoice attachment requirements",
      category: "Document Setup",
      status: "Not Started",
      priority: "Medium",
    },
  },
  {
    match: ["user role", "user roles", "role-based", "loan officer, admin"],
    missing: "Final user role permissions are not fully defined",
    task: {
      title: "Define user roles and permissions",
      category: "Access Control",
      status: "Not Started",
      priority: "Medium",
    },
  },
  {
    match: ["reporting", "turnaround"],
    missing: "Reporting requirements need confirmation",
    risk: {
      title: "Reporting requirements need more detail",
      severity: "Low",
      description:
        "Draw turnaround reporting is requested but the exact metrics are not yet defined.",
    },
    task: {
      title: "Set up draw turnaround reporting",
      category: "Reporting",
      status: "Not Started",
      priority: "Low",
    },
  },
];

function includesAny(haystack: string, needles: string[]): boolean {
  return needles.some((n) => haystack.includes(n.toLowerCase()));
}

function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
}

function extractLoanCount(notes: string): number | null {
  const patterns = [
    /(\d+)\s+active construction loans/,
    /onboard\s+(\d+)/,
    /(\d+)\s+(?:construction\s+)?loans/,
  ];
  for (const p of patterns) {
    const m = notes.match(p);
    if (m) return parseInt(m[1], 10);
  }
  return null;
}

function buildSummary(
  notes: string,
  customerName: string,
  customerType: CustomerType,
  loanCount: number | null,
  hasApproval: boolean,
): string {
  const lower = notes.toLowerCase();
  const needs: string[] = [];
  if (hasApproval) needs.push("separate approval workflows by loan type");
  if (includesAny(lower, ["inspection"])) needs.push("inspection handling");
  if (includesAny(lower, ["lien waiver", "invoice", "attachment"]))
    needs.push("borrower-submitted documents");
  if (includesAny(lower, ["reporting", "turnaround"])) needs.push("reporting");
  if (includesAny(lower, ["role", "permission"])) needs.push("role-based access");

  const scale = loanCount
    ? `${loanCount} active construction loans`
    : "new construction lending activity";
  const process = includesAny(lower, ["email", "excel", "spreadsheet", "manual"])
    ? " Their current process relies on email, spreadsheets, and manual follow-ups."
    : "";
  const needsPart = needs.length
    ? ` They need ${needs.slice(0, -1).join(", ")}${
        needs.length > 1 ? ", and " : ""
      }${needs[needs.length - 1]}.`
    : "";

  return `${customerName} (${customerType}) is onboarding ${scale} for draw management.${process}${needsPart}`.trim();
}

function deriveStatus(
  completeness: number,
  blockersCount: number,
): ProjectStatus {
  if (blockersCount >= 5 || completeness < 55) return "Needs Info";
  if (completeness >= 85 && blockersCount <= 1) return "In Review";
  if (completeness >= 95 && blockersCount === 0) return "Ready";
  return "In Progress";
}

let idCounter = 0;
function uid(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`;
}

export interface AnalyzeInput {
  notes: string;
  customerName: string;
  customerType: CustomerType;
}

export function analyzeIntake(input: AnalyzeInput): ImplementationProject {
  const customerName = input.customerName.trim() || "Untitled Customer";
  const customerType = input.customerType;
  const notes = input.notes ?? "";
  const lower = notes.toLowerCase();

  const missingInfo: MissingInfoItem[] = [];
  const risks: RiskItem[] = [];
  const tasks: ImplementationTask[] = [];
  const seenMissing = new Set<string>();
  const seenRisk = new Set<string>();
  const seenTask = new Set<string>();

  // 1. Loan import task (data-driven, comes first)
  const loanCount = extractLoanCount(notes);
  if (loanCount || includesAny(lower, ["import", "construction loan", "loans"])) {
    const title = loanCount
      ? `Import ${loanCount} active construction loans`
      : "Import construction loan data";
    tasks.push({
      id: uid("task"),
      title,
      category: "Data Import",
      status: "Not Started",
      priority: "High",
    });
    seenTask.add(title);
  }

  // 2. Approval workflow tasks (commercial + consumer)
  const hasApproval = includesAny(lower, [
    "approval path",
    "approval paths",
    "approval workflow",
    "two approval",
    "approval rules are different",
  ]);
  if (hasApproval || includesAny(lower, ["commercial", "consumer"])) {
    if (includesAny(lower, ["commercial"])) {
      tasks.push({
        id: uid("task"),
        title: "Configure commercial draw approval workflow",
        category: "Workflow Setup",
        status: "Not Started",
        priority: "High",
      });
    }
    if (includesAny(lower, ["consumer"])) {
      tasks.push({
        id: uid("task"),
        title: "Configure consumer draw approval workflow",
        category: "Workflow Setup",
        status: "Not Started",
        priority: "High",
      });
    }
  }

  // 3. Rule-driven items
  for (const rule of RULES) {
    if (!includesAny(lower, rule.match)) continue;
    if (rule.missing && !seenMissing.has(rule.missing)) {
      seenMissing.add(rule.missing);
      missingInfo.push({
        id: uid("miss"),
        text: rule.missing,
        completed: false,
      });
    }
    if (rule.risk && !seenRisk.has(rule.risk.title)) {
      seenRisk.add(rule.risk.title);
      risks.push({ id: uid("risk"), ...rule.risk });
    }
    if (rule.task && !seenTask.has(rule.task.title)) {
      seenTask.add(rule.task.title);
      tasks.push({ id: uid("task"), ...rule.task });
    }
  }

  // Fallback so the plan is never empty on unfamiliar input.
  if (tasks.length === 0) {
    tasks.push({
      id: uid("task"),
      title: "Review onboarding notes and scope platform setup",
      category: "Data Import",
      status: "Not Started",
      priority: "High",
    });
  }
  if (missingInfo.length === 0) {
    missingInfo.push({
      id: uid("miss"),
      text: "Confirm required fields and data sources with the customer",
      completed: false,
    });
  }

  // Metrics
  const highRisks = risks.filter((r) => r.severity === "High").length;
  const mediumRisks = risks.filter((r) => r.severity === "Medium").length;
  const blockersCount = highRisks + mediumRisks;
  const completenessScore = clamp(
    Math.round(
      100 - missingInfo.length * 4 - highRisks * 3 - mediumRisks * 1,
    ),
    5,
    100,
  );
  const timeSavedMinutes = tasks.length * 5;
  const status = deriveStatus(completenessScore, blockersCount);

  return {
    id: uid(`impl-${slug(customerName)}`),
    customerName,
    customerType,
    status,
    completenessScore,
    blockersCount,
    timeSavedMinutes,
    createdAt: new Date().toISOString(),
    summary: buildSummary(notes, customerName, customerType, loanCount, hasApproval),
    missingInfo,
    risks: sortRisks(risks),
    tasks,
    engine: "rules",
  };
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

const SEVERITY_ORDER: Record<Severity, number> = { High: 0, Medium: 1, Low: 2 };
function sortRisks(risks: RiskItem[]): RiskItem[] {
  return [...risks].sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity],
  );
}

/** Recompute derived metrics after a plan is edited (used by AI path + store). */
export function recomputeMetrics(
  project: ImplementationProject,
): ImplementationProject {
  const highRisks = project.risks.filter((r) => r.severity === "High").length;
  const mediumRisks = project.risks.filter((r) => r.severity === "Medium").length;
  const blockersCount = highRisks + mediumRisks;
  const completenessScore = clamp(
    Math.round(100 - project.missingInfo.length * 4 - highRisks * 3 - mediumRisks * 1),
    5,
    100,
  );
  return {
    ...project,
    blockersCount,
    completenessScore,
    timeSavedMinutes: project.tasks.length * 5,
    status: deriveStatus(completenessScore, blockersCount),
    risks: sortRisks(project.risks),
  };
}
