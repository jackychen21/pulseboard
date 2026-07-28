export const STATUSES = ["todo", "in_progress", "in_review", "done"] as const;
export const PRIORITIES = ["low", "normal", "high"] as const;

export type Status = (typeof STATUSES)[number];
export type Priority = (typeof PRIORITIES)[number];

export type Task = {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  dueDate: string | null;
  createdAt: string;
};

export type TaskDraft = {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string | null;
};

export type TaskFilter = {
  query: string;
  priority: "all" | Priority;
  dueWindow: "all" | "overdue" | "soon";
};

export type DataMode = "demo" | "supabase";

