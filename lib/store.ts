"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ImplementationProject,
  MissingInfoItem,
  TaskStatus,
} from "./types";
import { recomputeMetrics } from "./analyze";
import { SEED_PROJECTS } from "./sample-data";

interface ImplFlowState {
  projects: ImplementationProject[];
  hasHydrated: boolean;
  addProject: (project: ImplementationProject) => void;
  getProject: (id: string) => ImplementationProject | undefined;
  toggleMissingInfo: (projectId: string, itemId: string) => void;
  setTaskStatus: (projectId: string, taskId: string, status: TaskStatus) => void;
  resetToSeed: () => void;
  setHasHydrated: (v: boolean) => void;
}

function updateProject(
  projects: ImplementationProject[],
  id: string,
  fn: (p: ImplementationProject) => ImplementationProject,
): ImplementationProject[] {
  return projects.map((p) => (p.id === id ? recomputeMetrics(fn(p)) : p));
}

export const useImplFlowStore = create<ImplFlowState>()(
  persist(
    (set, get) => ({
      projects: SEED_PROJECTS,
      hasHydrated: false,
      addProject: (project) =>
        set((s) => ({ projects: [project, ...s.projects] })),
      getProject: (id) => get().projects.find((p) => p.id === id),
      toggleMissingInfo: (projectId, itemId) =>
        set((s) => ({
          projects: updateProject(s.projects, projectId, (p) => ({
            ...p,
            missingInfo: p.missingInfo.map((m: MissingInfoItem) =>
              m.id === itemId ? { ...m, completed: !m.completed } : m,
            ),
          })),
        })),
      setTaskStatus: (projectId, taskId, status) =>
        set((s) => ({
          projects: updateProject(s.projects, projectId, (p) => ({
            ...p,
            tasks: p.tasks.map((t) =>
              t.id === taskId ? { ...t, status } : t,
            ),
          })),
        })),
      resetToSeed: () => set({ projects: SEED_PROJECTS }),
      setHasHydrated: (v) => set({ hasHydrated: v }),
    }),
    {
      name: "implflow-store",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
