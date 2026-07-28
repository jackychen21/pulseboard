import { useState } from "react";
import type { Priority, TaskDraft } from "../types";

type NewTaskModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (draft: TaskDraft) => Promise<void>;
};

const initialState: TaskDraft = {
  title: "",
  description: "",
  priority: "normal",
  dueDate: null,
};

export function NewTaskModal({ open, onClose, onSubmit }: NewTaskModalProps) {
  const [form, setForm] = useState<TaskDraft>(initialState);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!open) {
    return null;
  }

  return (
    <div className="modal-shell" role="presentation" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-task-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal__header">
          <div>
            <p className="section-kicker">Create task</p>
            <h2 id="new-task-title">Add a new card</h2>
          </div>
          <button className="ghost-button" onClick={onClose} type="button">
            Close
          </button>
        </div>

        <form
          className="modal__body"
          onSubmit={async (event) => {
            event.preventDefault();
            if (!form.title.trim()) {
              setError("Title is required.");
              return;
            }

            setSaving(true);
            setError("");

            try {
              await onSubmit({
                ...form,
                title: form.title.trim(),
                description: form.description.trim(),
              });
              setForm(initialState);
              onClose();
            } catch (submitError) {
              setError(
                submitError instanceof Error
                  ? submitError.message
                  : "Could not create task.",
              );
            } finally {
              setSaving(false);
            }
          }}
        >
          <label>
            Title
            <input
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({ ...current, title: event.target.value }))
              }
              placeholder="Ship the reviewer-ready board"
            />
          </label>

          <label>
            Description
            <textarea
              rows={4}
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              placeholder="Add any context, notes, or acceptance criteria."
            />
          </label>

          <div className="modal__grid">
            <label>
              Priority
              <select
                value={form.priority}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    priority: event.target.value as Priority,
                  }))
                }
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </label>

            <label>
              Due date
              <input
                type="date"
                value={form.dueDate ?? ""}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    dueDate: event.target.value || null,
                  }))
                }
              />
            </label>
          </div>

          {error ? <p className="error-banner">{error}</p> : null}

          <div className="modal__actions">
            <button className="ghost-button" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="primary-button" type="submit" disabled={saving}>
              {saving ? "Creating..." : "Create task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

