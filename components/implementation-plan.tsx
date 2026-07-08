"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Gauge,
  ListChecks,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select } from "@/components/ui/input";
import {
  PriorityBadge,
  SeverityBadge,
  taskStatusClass,
} from "@/components/badges";
import { useImplFlowStore } from "@/lib/store";
import { TASK_STATUSES, type ImplementationProject } from "@/lib/types";
import { cn } from "@/lib/utils";

function Metric({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: React.ReactNode;
  accent: string;
}) {
  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <span className={cn("flex h-6 w-6 items-center justify-center rounded-md", accent)}>
            {icon}
          </span>
          {label}
        </div>
        <div className="mt-2 text-2xl font-semibold text-slate-900">{value}</div>
        {sub && <div className="mt-2">{sub}</div>}
      </CardContent>
    </Card>
  );
}

export function ImplementationPlan({ project }: { project: ImplementationProject }) {
  const toggleMissingInfo = useImplFlowStore((s) => s.toggleMissingInfo);
  const setTaskStatus = useImplFlowStore((s) => s.setTaskStatus);

  const completedMissing = project.missingInfo.filter((m) => m.completed).length;
  const hoursSaved = (project.timeSavedMinutes / 60).toFixed(1);

  return (
    <div className="space-y-5">
      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          icon={<Gauge className="h-3.5 w-3.5 text-indigo-600" />}
          accent="bg-indigo-50"
          label="Setup Completeness"
          value={`${project.completenessScore}%`}
          sub={<Progress value={project.completenessScore} />}
        />
        <Metric
          icon={<Clock className="h-3.5 w-3.5 text-emerald-600" />}
          accent="bg-emerald-50"
          label="Manual Review Time Saved"
          value={`${project.timeSavedMinutes} min`}
          sub={<span className="text-xs text-slate-500">≈ {hoursSaved} hours</span>}
        />
        <Metric
          icon={<AlertTriangle className="h-3.5 w-3.5 text-red-600" />}
          accent="bg-red-50"
          label="Blockers Found"
          value={`${project.blockersCount}`}
          sub={
            <span className="text-xs text-slate-500">
              {project.risks.filter((r) => r.severity === "High").length} high priority
            </span>
          }
        />
        <Metric
          icon={<ListChecks className="h-3.5 w-3.5 text-sky-600" />}
          accent="bg-sky-50"
          label="Tasks Generated"
          value={`${project.tasks.length}`}
          sub={
            <span className="text-xs text-slate-500">
              {project.tasks.filter((t) => t.status === "Blocked").length} blocked
            </span>
          }
        />
      </div>

      {/* Summary */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-600" />
          <CardTitle>Customer Summary</CardTitle>
          <span className="ml-auto rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-500">
            {project.engine === "openai" ? "AI-generated" : "Rules engine"}
          </span>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-slate-600">{project.summary}</p>
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Missing info */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-slate-400" />
            <CardTitle>Missing Information Checklist</CardTitle>
            <span className="ml-auto text-xs text-slate-400">
              {completedMissing}/{project.missingInfo.length} resolved
            </span>
          </CardHeader>
          <CardContent className="space-y-1">
            {project.missingInfo.map((item) => (
              <label
                key={item.id}
                className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2 hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleMissingInfo(project.id, item.id)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span
                  className={cn(
                    "text-sm text-slate-700",
                    item.completed && "text-slate-400 line-through",
                  )}
                >
                  {item.text}
                </span>
              </label>
            ))}
          </CardContent>
        </Card>

        {/* Blockers */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <CardTitle>Blockers &amp; Risks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {project.risks.length === 0 && (
              <p className="text-sm text-slate-400">No blockers detected.</p>
            )}
            {project.risks.map((risk) => (
              <div
                key={risk.id}
                className="rounded-lg border border-slate-100 bg-slate-50/60 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-slate-800">
                    {risk.title}
                  </span>
                  <SeverityBadge severity={risk.severity} />
                </div>
                <p className="mt-1 text-xs text-slate-500">{risk.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Task board */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <ListChecks className="h-4 w-4 text-indigo-600" />
          <CardTitle>Implementation Task Board</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {TASK_STATUSES.map((status) => {
              const tasks = project.tasks.filter((t) => t.status === status);
              return (
                <div key={status} className="rounded-lg bg-slate-50/70 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600">
                      {status}
                    </span>
                    <span className="rounded-full bg-white px-1.5 text-[11px] text-slate-500 ring-1 ring-slate-200">
                      {tasks.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm"
                      >
                        <div className="text-sm text-slate-800">{task.title}</div>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <span className="text-[11px] text-slate-400">
                            {task.category}
                          </span>
                          <PriorityBadge priority={task.priority} />
                        </div>
                        <Select
                          value={task.status}
                          onChange={(e) =>
                            setTaskStatus(
                              project.id,
                              task.id,
                              e.target.value as (typeof TASK_STATUSES)[number],
                            )
                          }
                          className={cn(
                            "mt-2 h-7 text-xs",
                            taskStatusClass(task.status),
                          )}
                        >
                          {TASK_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </Select>
                      </div>
                    ))}
                    {tasks.length === 0 && (
                      <div className="rounded-lg border border-dashed border-slate-200 py-4 text-center text-[11px] text-slate-300">
                        None
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
