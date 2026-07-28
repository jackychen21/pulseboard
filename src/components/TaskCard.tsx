import { PRIORITY_META } from "../constants";
import { formatDate, getDueBadge } from "../utils";
import type { Task } from "../types";

type TaskCardProps = {
  task: Task;
};

export function TaskCard({ task }: TaskCardProps) {
  const dueBadge = getDueBadge(task.dueDate);

  return (
    <article
      className="task-card"
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData("text/plain", task.id);
      }}
    >
      <div className="task-card__header">
        <span
          className="pill"
          style={{
            background: PRIORITY_META[task.priority].accent,
          }}
        >
          {PRIORITY_META[task.priority].label}
        </span>
        <span className={`due-badge due-badge--${dueBadge.tone}`}>{dueBadge.label}</span>
      </div>
      <h3>{task.title}</h3>
      <p>{task.description || "No extra notes yet."}</p>
      <div className="task-card__footer">
        <span>Created {formatDate(task.createdAt.slice(0, 10))}</span>
      </div>
    </article>
  );
}

