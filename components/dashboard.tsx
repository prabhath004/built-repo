"use client";

import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  Gauge,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/badges";
import { useImplFlowStore } from "@/lib/store";
import { formatRelative } from "@/lib/utils";

function Kpi({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <span className={`flex h-6 w-6 items-center justify-center rounded-md ${accent}`}>
            {icon}
          </span>
          {label}
        </div>
        <div className="mt-2 text-2xl font-semibold text-slate-900">{value}</div>
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  const projects = useImplFlowStore((s) => s.projects);

  const total = projects.length;
  const avgCompleteness = total
    ? Math.round(
        projects.reduce((a, p) => a + p.completenessScore, 0) / total,
      )
    : 0;
  const totalBlockers = projects.reduce((a, p) => a + p.blockersCount, 0);
  const hoursSaved = (
    projects.reduce((a, p) => a + p.timeSavedMinutes, 0) / 60
  ).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Implementation Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Turn messy onboarding notes into a launch-ready implementation plan.
          </p>
        </div>
        <Link href="/intake">
          <Button>
            <Plus className="h-4 w-4" /> New Intake
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi
          icon={<Activity className="h-3.5 w-3.5 text-indigo-600" />}
          accent="bg-indigo-50"
          label="Active implementations"
          value={`${total}`}
        />
        <Kpi
          icon={<Gauge className="h-3.5 w-3.5 text-sky-600" />}
          accent="bg-sky-50"
          label="Avg completeness"
          value={`${avgCompleteness}%`}
        />
        <Kpi
          icon={<AlertTriangle className="h-3.5 w-3.5 text-red-600" />}
          accent="bg-red-50"
          label="Blockers detected"
          value={`${totalBlockers}`}
        />
        <Kpi
          icon={<Clock className="h-3.5 w-3.5 text-emerald-600" />}
          accent="bg-emerald-50"
          label="Hours saved"
          value={hoursSaved}
        />
      </div>

      <Card>
        <div className="border-b border-slate-100 px-5 py-3">
          <h2 className="text-sm font-semibold text-slate-900">
            Recent implementation projects
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-medium text-slate-500">
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3 w-48">Completeness</th>
                <th className="px-5 py-3">Blockers</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Created</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr
                  key={p.id}
                  className="group border-b border-slate-50 last:border-0 hover:bg-slate-50/60"
                >
                  <td className="px-5 py-3">
                    <Link
                      href={`/project/${p.id}`}
                      className="font-medium text-slate-900 hover:text-indigo-600"
                    >
                      {p.customerName}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-slate-500">{p.customerType}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Progress value={p.completenessScore} className="w-24" />
                      <span className="text-xs text-slate-500">
                        {p.completenessScore}%
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-700">{p.blockersCount}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-5 py-3 text-slate-400">
                    {formatRelative(p.createdAt)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/project/${p.id}`}
                      className="inline-flex items-center gap-1 text-xs text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-indigo-600"
                    >
                      View <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
