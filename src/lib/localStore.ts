import { demoTasks } from "../demoData";
import type { Status, Task, TaskDraft } from "../types";

const STORAGE_KEY = "pulseboard-demo-tasks";

function load(): Task[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(demoTasks));
    return demoTasks;
  }

  try {
    return JSON.parse(raw) as Task[];
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(demoTasks));
    return demoTasks;
  }
}

function save(tasks: Task[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export const localStore = {
  async listTasks(): Promise<Task[]> {
    return load();
  },
  async createTask(draft: TaskDraft): Promise<Task> {
    const nextTask: Task = {
      id: crypto.randomUUID(),
      status: "todo",
      createdAt: new Date().toISOString(),
      ...draft,
    };
    const tasks = [nextTask, ...load()];
    save(tasks);
    return nextTask;
  },
  async updateStatus(id: string, status: Status): Promise<void> {
    const nextTasks = load().map((task) =>
      task.id === id ? { ...task, status } : task,
    );
    save(nextTasks);
  },
};

