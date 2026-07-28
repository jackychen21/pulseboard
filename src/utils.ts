import { PRIORITY_META, STATUS_META } from "./constants";
import type { Priority, Status, Task, TaskFilter } from "./types";

export function formatDate(date: string | null): string {
  if (!date) {
    return "No deadline";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export function getDueBadge(date: string | null): {
  label: string;
  tone: "neutral" | "warning" | "danger";
} {
  if (!date) {
    return { label: "No deadline", tone: "neutral" };
  }

  const target = new Date(`${date}T00:00:00`);
  const today = new Date();
  const todayMidnight = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const diffDays = Math.ceil(
    (target.getTime() - todayMidnight.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays < 0) {
    return { label: `Overdue ${Math.abs(diffDays)}d`, tone: "danger" };
  }

  if (diffDays <= 2) {
    return { label: diffDays === 0 ? "Due today" : `Due in ${diffDays}d`, tone: "warning" };
  }

  return { label: formatDate(date), tone: "neutral" };
}

export function filterTasks(tasks: Task[], filter: TaskFilter): Task[] {
  return tasks.filter((task) => {
    const normalized = `${task.title} ${task.description}`.toLowerCase();
    const matchesQuery = normalized.includes(filter.query.trim().toLowerCase());
    const matchesPriority =
      filter.priority === "all" || task.priority === filter.priority;
    const dueBadge = getDueBadge(task.dueDate);
    const matchesDue =
      filter.dueWindow === "all" ||
      (filter.dueWindow === "overdue" && dueBadge.tone === "danger") ||
      (filter.dueWindow === "soon" && dueBadge.tone === "warning");

    return matchesQuery && matchesPriority && matchesDue;
  });
}

export function groupTasks(tasks: Task[]): Record<Status, Task[]> {
  return {
    todo: tasks.filter((task) => task.status === "todo"),
    in_progress: tasks.filter((task) => task.status === "in_progress"),
    in_review: tasks.filter((task) => task.status === "in_review"),
    done: tasks.filter((task) => task.status === "done"),
  };
}

export function getSummary(tasks: Task[]) {
  const overdue = tasks.filter((task) => getDueBadge(task.dueDate).tone === "danger").length;
  const dueSoon = tasks.filter((task) => getDueBadge(task.dueDate).tone === "warning").length;

  return {
    total: tasks.length,
    completed: tasks.filter((task) => task.status === "done").length,
    inFlight: tasks.filter((task) => task.status !== "done").length,
    overdue,
    dueSoon,
  };
}

export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    const priorityOrder: Record<Priority, number> = {
      high: 0,
      normal: 1,
      low: 2,
    };

    return (
      priorityOrder[a.priority] - priorityOrder[b.priority] ||
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  });
}

export function getStatusLabel(status: Status): string {
  return STATUS_META[status].label;
}

export function getPriorityLabel(priority: Priority): string {
  return PRIORITY_META[priority].label;
}

