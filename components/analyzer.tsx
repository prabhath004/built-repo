"use client";

import { useState } from "react";
import { FileText, Loader2, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImplementationPlan } from "@/components/implementation-plan";
import { analyzeIntake } from "@/lib/analyze";
import { SAMPLE_NOTES } from "@/lib/sample-data";
import { useImplFlowStore } from "@/lib/store";
import { CUSTOMER_TYPES, type CustomerType, type ImplementationProject } from "@/lib/types";

const MIN_SPINNER_MS = 900;

export function Analyzer() {
  const addProject = useImplFlowStore((s) => s.addProject);
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeProject = useImplFlowStore((s) =>
    s.projects.find((p) => p.id === activeId),
  );

  const [customerName, setCustomerName] = useState("");
  const [customerType, setCustomerType] = useState<CustomerType>("Bank");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  function loadSample() {
    setCustomerName("Riverstone Community Bank");
    setCustomerType("Bank");
    setNotes(SAMPLE_NOTES);
  }

  async function analyze() {
    if (!notes.trim()) return;
    setLoading(true);
    const startedAt = Date.now();

    let project: ImplementationProject;
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes, customerName, customerType }),
      });
      if (!res.ok) throw new Error(`analyze failed: ${res.status}`);
      project = (await res.json()) as ImplementationProject;
    } catch {
      // Offline / API failure — deterministic client-side fallback.
      project = analyzeIntake({ notes, customerName, customerType });
    }

    const elapsed = Date.now() - startedAt;
    if (elapsed < MIN_SPINNER_MS) {
      await new Promise((r) => setTimeout(r, MIN_SPINNER_MS - elapsed));
    }

    addProject(project);
    setActiveId(project.id);
    setLoading(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      {/* Intake form */}
      <div className="lg:sticky lg:top-20 lg:self-start">
        <Card>
          <CardContent className="space-y-4 pt-5">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Customer name
              </label>
              <Input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Riverstone Community Bank"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Customer type
              </label>
              <Select
                value={customerType}
                onChange={(e) => setCustomerType(e.target.value as CustomerType)}
              >
                {CUSTOMER_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-xs font-medium text-slate-600">
                  Onboarding notes
                </label>
                <button
                  onClick={loadSample}
                  className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"
                >
                  <Wand2 className="h-3 w-3" /> Load sample
                </button>
              </div>
              <Textarea
                rows={14}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Paste kickoff notes, onboarding requirements, or messy customer setup details. ImplFlow will extract missing information, blockers, tasks, and a setup completeness score."
              />
            </div>
            <Button
              onClick={analyze}
              disabled={loading || !notes.trim()}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Analyzing…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Analyze Intake
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      <div>
        {loading && !activeProject && <SkeletonPlan />}
        {activeProject && !loading && (
          <div className="animate-fade-in space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Implementation Plan
              </h2>
              <p className="text-sm text-slate-500">
                {activeProject.customerName} · {activeProject.customerType}
              </p>
            </div>
            <ImplementationPlan project={activeProject} />
          </div>
        )}
        {!activeProject && !loading && <EmptyState />}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white/50 p-10 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
        <FileText className="h-6 w-6 text-indigo-500" />
      </span>
      <h3 className="mt-4 text-sm font-semibold text-slate-800">
        No plan generated yet
      </h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">
        Paste onboarding notes and click <b>Analyze Intake</b>. Try{" "}
        <b>Load sample</b> to see ImplFlow turn a messy kickoff call into a
        launch-ready plan.
      </p>
    </div>
  );
}

function SkeletonPlan() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-100" />
        ))}
      </div>
      <div className="h-28 animate-pulse rounded-xl bg-slate-100" />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-56 animate-pulse rounded-xl bg-slate-100" />
        <div className="h-56 animate-pulse rounded-xl bg-slate-100" />
      </div>
      <div className="h-64 animate-pulse rounded-xl bg-slate-100" />
    </div>
  );
}
