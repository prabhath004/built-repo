import { Badge } from "@/components/ui/badge";
import type {
  Priority,
  ProjectStatus,
  Severity,
  TaskStatus,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<ProjectStatus, string> = {
  "Needs Info": "border-amber-200 bg-amber-50 text-amber-700",
  "In Progress": "border-indigo-200 bg-indigo-50 text-indigo-700",
  "In Review": "border-sky-200 bg-sky-50 text-sky-700",
  Ready: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return <Badge className={STATUS_STYLES[status]}>{status}</Badge>;
}

const SEVERITY_STYLES: Record<Severity, string> = {
  High: "border-red-200 bg-red-50 text-red-700",
  Medium: "border-amber-200 bg-amber-50 text-amber-700",
  Low: "border-slate-200 bg-slate-50 text-slate-600",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <Badge className={SEVERITY_STYLES[severity]}>
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          severity === "High" && "bg-red-500",
          severity === "Medium" && "bg-amber-500",
          severity === "Low" && "bg-slate-400",
        )}
      />
      {severity}
    </Badge>
  );
}

const PRIORITY_STYLES: Record<Priority, string> = {
  High: "border-red-200 bg-red-50 text-red-700",
  Medium: "border-amber-200 bg-amber-50 text-amber-700",
  Low: "border-slate-200 bg-slate-50 text-slate-600",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return <Badge className={PRIORITY_STYLES[priority]}>{priority}</Badge>;
}

const TASK_STATUS_STYLES: Record<TaskStatus, string> = {
  "Not Started": "border-slate-200 bg-slate-50 text-slate-600",
  Blocked: "border-red-200 bg-red-50 text-red-700",
  "In Progress": "border-indigo-200 bg-indigo-50 text-indigo-700",
  "Ready for Review": "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export function taskStatusClass(status: TaskStatus): string {
  return TASK_STATUS_STYLES[status];
}
