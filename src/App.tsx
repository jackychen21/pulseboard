import { useEffect, useMemo, useState } from "react";
import { BoardColumn } from "./components/BoardColumn";
import { NewTaskModal } from "./components/NewTaskModal";
import { STATUSES, type Status, type Task, type TaskDraft, type TaskFilter } from "./types";
import { filterTasks, getSummary, groupTasks, sortTasks } from "./utils";
import { getTaskStore } from "./lib/taskStore";
import { supabaseStore } from "./lib/supabase";

const defaultFilter: TaskFilter = {
  query: "",
  priority: "all",
  dueWindow: "all",
};

export function App() {
  const [{ mode, store }] = useState(() => getTaskStore());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingTaskId, setSavingTaskId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<TaskFilter>(defaultFilter);
  const [open, setOpen] = useState(false);

  async function loadTasks() {
    setLoading(true);
    setError("");
    try {
      const data = await store.listTasks();
      setTasks(sortTasks(data));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load tasks.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    if (mode !== "supabase") {
      return undefined;
    }

    return supabaseStore.subscribe(() => {
      loadTasks();
    });
  }, [mode]);

  const filtered = useMemo(() => filterTasks(tasks, filter), [tasks, filter]);
  const grouped = useMemo(() => groupTasks(filtered), [filtered]);
  const summary = useMemo(() => getSummary(tasks), [tasks]);

  async function handleCreateTask(draft: TaskDraft) {
    setError("");
    const task = await store.createTask(draft);
    setTasks((current) => sortTasks([task, ...current]));
  }

  async function handleDropTask(taskId: string, status: Status) {
    const existing = tasks.find((task) => task.id === taskId);
    if (!existing || existing.status === status) {
      return;
    }

    setSavingTaskId(taskId);
    setError("");
    setTasks((current) =>
      sortTasks(
        current.map((task) => (task.id === taskId ? { ...task, status } : task)),
      ),
    );

    try {
      await store.updateStatus(taskId, status);
    } catch (updateError) {
      setTasks((current) =>
        sortTasks(
          current.map((task) =>
            task.id === taskId ? { ...task, status: existing.status } : task,
          ),
        ),
      );
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Could not move task.",
      );
    } finally {
      setSavingTaskId(null);
    }
  }

  return (
    <div className="app-shell">
      <div className="background-orb background-orb--one" />
      <div className="background-orb background-orb--two" />

      <aside className="sidebar">
        <div className="brand-block">
          <p className="section-kicker">PulseBoard</p>
          <h1>Kanban that feels sharp enough to demo.</h1>
          <p className="muted-copy">
            A reviewer-ready task board with drag-and-drop, filtering, due date
            signals, guest session support, and Supabase-ready persistence.
          </p>
        </div>

        <div className="summary-panel">
          <div>
            <p className="section-kicker">Workspace pulse</p>
            <h2>{summary.total} tasks</h2>
          </div>
          <div className="summary-grid">
            <article>
              <span>{summary.completed}</span>
              <p>Completed</p>
            </article>
            <article>
              <span>{summary.inFlight}</span>
              <p>In flight</p>
            </article>
            <article>
              <span>{summary.overdue}</span>
              <p>Overdue</p>
            </article>
            <article>
              <span>{summary.dueSoon}</span>
              <p>Due soon</p>
            </article>
          </div>
        </div>

        <div className="filter-panel">
          <div className="filter-panel__header">
            <p className="section-kicker">Filters</p>
            <button className="ghost-button" type="button" onClick={() => setFilter(defaultFilter)}>
              Reset
            </button>
          </div>

          <label>
            Search
            <input
              value={filter.query}
              onChange={(event) =>
                setFilter((current) => ({ ...current, query: event.target.value }))
              }
              placeholder="Find by title or notes"
            />
          </label>

          <label>
            Priority
            <select
              value={filter.priority}
              onChange={(event) =>
                setFilter((current) => ({
                  ...current,
                  priority: event.target.value as TaskFilter["priority"],
                }))
              }
            >
              <option value="all">All priorities</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>
          </label>

          <label>
            Due date
            <select
              value={filter.dueWindow}
              onChange={(event) =>
                setFilter((current) => ({
                  ...current,
                  dueWindow: event.target.value as TaskFilter["dueWindow"],
                }))
              }
            >
              <option value="all">Everything</option>
              <option value="soon">Due soon</option>
              <option value="overdue">Overdue</option>
            </select>
          </label>
        </div>
      </aside>

      <main className="board-shell">
        <header className="board-topbar">
          <div>
            <p className="section-kicker">Assessment board</p>
            <h2>Build, move, and track work without losing the visual rhythm.</h2>
          </div>
          <div className="board-topbar__actions">
            <span className="mode-pill">{mode === "supabase" ? "Supabase live mode" : "Demo mode"}</span>
            <button className="primary-button" type="button" onClick={() => setOpen(true)}>
              New task
            </button>
          </div>
        </header>

        {error ? <div className="error-banner">{error}</div> : null}

        {loading ? (
          <section className="loading-state">
            <div className="loading-state__pulse" />
            <p>Loading board...</p>
          </section>
        ) : (
          <>
            {savingTaskId ? (
              <p className="status-line">Updating task status...</p>
            ) : null}
            <section className="board-grid">
              {STATUSES.map((status) => (
                <BoardColumn
                  key={status}
                  status={status}
                  tasks={grouped[status]}
                  onDropTask={handleDropTask}
                />
              ))}
            </section>
          </>
        )}
      </main>

      <NewTaskModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleCreateTask}
      />
    </div>
  );
}

