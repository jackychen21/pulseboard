import type { Task } from "./types";

export const demoTasks: Task[] = [
  {
    id: "task-1",
    title: "Design the launch board hero",
    description: "Dial in the hierarchy, rhythm, and typography so the board feels intentional.",
    status: "todo",
    priority: "high",
    dueDate: "2026-07-30",
    createdAt: "2026-07-27T16:00:00.000Z",
  },
  {
    id: "task-2",
    title: "Hook drag and drop to persistence",
    description: "Apply optimistic updates first, then sync the new status in the data layer.",
    status: "in_progress",
    priority: "high",
    dueDate: "2026-07-29",
    createdAt: "2026-07-27T18:30:00.000Z",
  },
  {
    id: "task-3",
    title: "Write setup notes for reviewers",
    description: "Document local setup, environment variables, and the SQL schema.",
    status: "in_review",
    priority: "normal",
    dueDate: "2026-07-31",
    createdAt: "2026-07-28T01:00:00.000Z",
  },
  {
    id: "task-4",
    title: "Ship board summary widgets",
    description: "Surface task totals, overdue cards, and due-soon indicators in the sidebar.",
    status: "done",
    priority: "low",
    dueDate: null,
    createdAt: "2026-07-26T12:00:00.000Z",
  },
];

