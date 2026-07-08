"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ImplementationPlan } from "@/components/implementation-plan";
import { StatusBadge } from "@/components/badges";
import { useImplFlowStore } from "@/lib/store";

export default function ProjectPage() {
  const params = useParams<{ id: string }>();
  const project = useImplFlowStore((s) =>
    s.projects.find((p) => p.id === params.id),
  );
  const hasHydrated = useImplFlowStore((s) => s.hasHydrated);

  if (!project) {
    return (
      <div className="space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>
        <div className="rounded-xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-500">
          {hasHydrated ? "Project not found." : "Loading…"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            {project.customerName}
          </h1>
          <p className="text-sm text-slate-500">{project.customerType}</p>
        </div>
        <div className="ml-auto">
          <StatusBadge status={project.status} />
        </div>
      </div>
      <ImplementationPlan project={project} />
    </div>
  );
}
