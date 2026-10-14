import type { Task } from "./types";

// dates are relative to today so the demo board never goes stale
function daysFromNow(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function daysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

export const demoTasks: Task[] = [
  {
    id: "task-1",
    title: "Design the launch board hero",
    description: "Dial in the hierarchy, rhythm, and typography so the board feels intentional.",
    status: "todo",
    priority: "high",
    dueDate: daysFromNow(2),
    createdAt: daysAgo(3),
  },
  {
    id: "task-2",
    title: "Hook drag and drop to persistence",
    description: "Apply optimistic updates first, then sync the new status in the data layer.",
    status: "in_progress",
    priority: "high",
    dueDate: daysFromNow(-1),
    createdAt: daysAgo(3),
  },
  {
    id: "task-3",
    title: "Write setup notes for reviewers",
    description: "Document local setup, environment variables, and the SQL schema.",
    status: "in_review",
    priority: "normal",
    dueDate: daysFromNow(6),
    createdAt: daysAgo(2),
  },
  {
    id: "task-4",
    title: "Ship board summary widgets",
    description: "Surface task totals, overdue cards, and due-soon indicators in the sidebar.",
    status: "done",
    priority: "low",
    dueDate: null,
    createdAt: daysAgo(4),
  },
];
