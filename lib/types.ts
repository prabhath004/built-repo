export type CustomerType =
  | "Bank"
  | "Private Credit"
  | "Owner/Developer"
  | "General Contractor";

export type ProjectStatus = "Needs Info" | "In Progress" | "In Review" | "Ready";

export type Severity = "High" | "Medium" | "Low";

export type TaskCategory =
  | "Data Import"
  | "Data Cleanup"
  | "Workflow Setup"
  | "Document Setup"
  | "Customer Follow-up"
  | "Access Control"
  | "Reporting";

export type TaskStatus =
  | "Not Started"
  | "Blocked"
  | "In Progress"
  | "Ready for Review";

export type Priority = "High" | "Medium" | "Low";

export interface MissingInfoItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface RiskItem {
  id: string;
  title: string;
  severity: Severity;
  description: string;
}

export interface ImplementationTask {
  id: string;
  title: string;
  category: TaskCategory;
  status: TaskStatus;
  priority: Priority;
}

export interface ImplementationProject {
  id: string;
  customerName: string;
  customerType: CustomerType;
  status: ProjectStatus;
  completenessScore: number;
  blockersCount: number;
  timeSavedMinutes: number;
  createdAt: string;
  summary: string;
  missingInfo: MissingInfoItem[];
  risks: RiskItem[];
  tasks: ImplementationTask[];
  /** How the plan was produced. */
  engine: "rules" | "openai";
}

export const CUSTOMER_TYPES: CustomerType[] = [
  "Bank",
  "Private Credit",
  "Owner/Developer",
  "General Contractor",
];

export const TASK_STATUSES: TaskStatus[] = [
  "Not Started",
  "Blocked",
  "In Progress",
  "Ready for Review",
];
