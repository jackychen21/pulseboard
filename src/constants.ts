import type { Priority, Status } from "./types";

export const STATUS_META: Record<
  Status,
  { label: string; accent: string; description: string }
> = {
  todo: {
    label: "To Do",
    accent: "var(--todo)",
    description: "Tasks queued up for the next sprint beat.",
  },
  in_progress: {
    label: "In Progress",
    accent: "var(--progress)",
    description: "Work that is actively moving right now.",
  },
  in_review: {
    label: "In Review",
    accent: "var(--review)",
    description: "Polish, verify, and tighten the rough edges.",
  },
  done: {
    label: "Done",
    accent: "var(--done)",
    description: "Shipped work and resolved outcomes.",
  },
};

export const PRIORITY_META: Record<
  Priority,
  { label: string; accent: string }
> = {
  low: { label: "Low", accent: "var(--low)" },
  normal: { label: "Normal", accent: "var(--normal)" },
  high: { label: "High", accent: "var(--high)" },
};

