import { NextResponse } from "next/server";
import OpenAI from "openai";
import { analyzeIntake, recomputeMetrics } from "@/lib/analyze";
import type {
  CustomerType,
  ImplementationProject,
  Priority,
  Severity,
  TaskCategory,
  TaskStatus,
} from "@/lib/types";
import { CUSTOMER_TYPES } from "@/lib/types";

export const runtime = "nodejs";

const SEVERITIES: Severity[] = ["High", "Medium", "Low"];
const CATEGORIES: TaskCategory[] = [
  "Data Import",
  "Data Cleanup",
  "Workflow Setup",
  "Document Setup",
  "Customer Follow-up",
  "Access Control",
  "Reporting",
];
const STATUSES: TaskStatus[] = [
  "Not Started",
  "Blocked",
  "In Progress",
  "Ready for Review",
];
const PRIORITIES: Priority[] = ["High", "Medium", "Low"];

function oneOf<T extends string>(value: unknown, allowed: T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

const SYSTEM_PROMPT = `You are ImplFlow, an internal tool for implementation managers at a construction-finance / real-estate lending platform (draw management, inspections, lien waivers, budgets, approval workflows, role-based access).

Given messy customer onboarding notes, produce a structured implementation plan. Write in plain business language an implementation manager would use. Respond with ONLY a JSON object of this exact shape:

{
  "summary": string,                       // 2-4 sentence customer setup summary
  "missingInfo": string[],                 // 4-8 concrete missing/unclear items
  "risks": [                               // blockers/risks, most severe first
    { "title": string, "severity": "High"|"Medium"|"Low", "description": string }
  ],
  "tasks": [                               // concrete implementation tasks
    {
      "title": string,
      "category": "Data Import"|"Data Cleanup"|"Workflow Setup"|"Document Setup"|"Customer Follow-up"|"Access Control"|"Reporting",
      "status": "Not Started"|"Blocked"|"In Progress"|"Ready for Review",
      "priority": "High"|"Medium"|"Low"
    }
  ]
}

Rules: tasks that depend on missing customer info should have status "Blocked". Do not include any prose outside the JSON.`;

async function analyzeWithOpenAI(
  notes: string,
  customerName: string,
  customerType: CustomerType,
): Promise<ImplementationProject | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const client = new OpenAI({ apiKey });
  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Customer: ${customerName || "Unknown"}\nCustomer type: ${customerType}\n\nOnboarding notes:\n"""\n${notes}\n"""`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) return null;

  const parsed = JSON.parse(raw) as {
    summary?: string;
    missingInfo?: string[];
    risks?: { title?: string; severity?: string; description?: string }[];
    tasks?: {
      title?: string;
      category?: string;
      status?: string;
      priority?: string;
    }[];
  };

  const missingInfo = (parsed.missingInfo ?? [])
    .filter((t) => typeof t === "string" && t.trim())
    .map((text, i) => ({ id: `ai-miss-${i}`, text: text.trim(), completed: false }));

  const risks = (parsed.risks ?? [])
    .filter((r) => r && typeof r.title === "string")
    .map((r, i) => ({
      id: `ai-risk-${i}`,
      title: r.title!.trim(),
      severity: oneOf(r.severity, SEVERITIES, "Medium"),
      description: (r.description ?? "").trim(),
    }));

  const tasks = (parsed.tasks ?? [])
    .filter((t) => t && typeof t.title === "string")
    .map((t, i) => ({
      id: `ai-task-${i}`,
      title: t.title!.trim(),
      category: oneOf(t.category, CATEGORIES, "Workflow Setup"),
      status: oneOf(t.status, STATUSES, "Not Started"),
      priority: oneOf(t.priority, PRIORITIES, "Medium"),
    }));

  if (tasks.length === 0 && missingInfo.length === 0) return null;

  const base: ImplementationProject = {
    id: `impl-ai-${Date.now().toString(36)}`,
    customerName: customerName.trim() || "Untitled Customer",
    customerType,
    status: "In Progress",
    completenessScore: 0,
    blockersCount: 0,
    timeSavedMinutes: 0,
    createdAt: new Date().toISOString(),
    summary: (parsed.summary ?? "").trim() || "Summary unavailable.",
    missingInfo,
    risks,
    tasks,
    engine: "openai",
  };

  return recomputeMetrics(base);
}

export async function POST(request: Request) {
  let body: {
    notes?: string;
    customerName?: string;
    customerType?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const notes = (body.notes ?? "").toString();
  const customerName = (body.customerName ?? "").toString();
  const customerType = oneOf<CustomerType>(
    body.customerType,
    CUSTOMER_TYPES,
    "Bank",
  );

  // Try the AI path; fall back to the deterministic rules engine on any error
  // (no key, network failure, malformed output) so the demo never breaks.
  try {
    const ai = await analyzeWithOpenAI(notes, customerName, customerType);
    if (ai) return NextResponse.json(ai);
  } catch (err) {
    console.error("OpenAI analyze failed, falling back to rules:", err);
  }

  const rules = analyzeIntake({ notes, customerName, customerType });
  return NextResponse.json(rules);
}
