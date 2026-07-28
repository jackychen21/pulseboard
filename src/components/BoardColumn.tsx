import { STATUS_META } from "../constants";
import { TaskCard } from "./TaskCard";
import type { Status, Task } from "../types";

type BoardColumnProps = {
  status: Status;
  tasks: Task[];
  onDropTask: (taskId: string, status: Status) => void;
};

export function BoardColumn({ status, tasks, onDropTask }: BoardColumnProps) {
  return (
    <section
      className="board-column"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        const taskId = event.dataTransfer.getData("text/plain");
        if (taskId) {
          onDropTask(taskId, status);
        }
      }}
    >
      <header className="board-column__header">
        <div>
          <p className="board-column__eyebrow" style={{ color: STATUS_META[status].accent }}>
            {STATUS_META[status].label}
          </p>
          <h2>{tasks.length}</h2>
        </div>
        <span className="board-column__description">{STATUS_META[status].description}</span>
      </header>

      <div className="board-column__body">
        {tasks.length === 0 ? (
          <div className="empty-column">
            <p>No tasks here yet.</p>
            <span>Drop a card to move work into this lane.</span>
          </div>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </section>
  );
}

