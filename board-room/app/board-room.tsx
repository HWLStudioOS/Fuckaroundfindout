"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import { isEditableTask } from "./board-state";
import type { BoardData, BoardTask, TaskState } from "./types";

type Filter = "priority" | "waiting" | "scheduled" | "parked" | "closed";

const FILTERS: Array<{ id: Filter; label: string }> = [
  { id: "priority", label: "Priority order" },
  { id: "waiting", label: "Waiting" },
  { id: "scheduled", label: "Scheduled" },
  { id: "parked", label: "Parked" },
  { id: "closed", label: "Closed" },
];

const STATE_LABELS: Record<TaskState, string> = {
  todo: "Open",
  "in-progress": "In motion",
  waiting: "Waiting",
  scheduled: "Scheduled",
  parked: "Parked",
  done: "Closed",
};

function tasksForFilter(tasks: BoardTask[], filter: Filter) {
  if (filter === "priority") {
    return tasks.filter((task) => task.state === "todo" || task.state === "in-progress");
  }
  if (filter === "closed") return tasks.filter((task) => task.state === "done");
  return tasks.filter((task) => task.state === filter);
}

function Metric({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="metric">
      <span className="metric-value">
        {value}
        {suffix ? <small>{suffix}</small> : null}
      </span>
      <span className="metric-label">{label}</span>
    </div>
  );
}

export function BoardRoom({ data: initialData }: { data: BoardData }) {
  const [data, setData] = useState(initialData);
  const [filter, setFilter] = useState<Filter>("priority");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const visibleTasks = useMemo(
    () => tasksForFilter(data.tasks, filter),
    [data.tasks, filter],
  );
  const lead = data.tasks.find(
    (task) => task.state === "in-progress" || task.state === "todo",
  );

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/board", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Live changes could not be loaded.");
        return response.json() as Promise<BoardData>;
      })
      .then(setData)
      .catch((error: Error) => {
        if (error.name !== "AbortError") setNotice(error.message);
      });
    return () => controller.abort();
  }, []);

  async function updateTask(id: string, change: { title?: string; state?: "todo" | "done" }) {
    setPendingId(id);
    setNotice(null);
    try {
      const response = await fetch("/api/board", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...change }),
      });
      const result = await response.json() as BoardData | { error?: string };
      if (!response.ok) {
        throw new Error("error" in result && result.error ? result.error : "The change could not be saved.");
      }
      setData(result as BoardData);
      setEditingId(null);
      setDraftTitle("");
      setNotice(change.state === "done" ? "Loop closed." : change.state === "todo" ? "Loop reopened." : "Task updated.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "The change could not be saved.");
    } finally {
      setPendingId(null);
    }
  }

  function startEditing(task: BoardTask) {
    setFilter(task.state === "done" ? "closed" : "priority");
    setEditingId(task.id);
    setDraftTitle(task.title);
    setNotice(null);
    window.setTimeout(() => {
      document.getElementById(`task-${task.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 0);
  }

  function submitEdit(event: FormEvent<HTMLFormElement>, task: BoardTask) {
    event.preventDefault();
    void updateTask(task.id, { title: draftTitle });
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div className="wordmark">
          <span className="wordmark-mark" aria-hidden="true">BR</span>
          <div>
            <p>The Board Room</p>
            <span>Harrison Living</span>
          </div>
        </div>
        <div className="sync-state">
          <span className="live-dot" aria-hidden="true" />
          Nightly source · {new Date(`${data.sourceDate}T12:00:00Z`).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            timeZone: "Europe/London",
          })}
        </div>
      </header>

      <section className="intro" aria-labelledby="page-title">
        <div>
          <p className="eyebrow">{data.week}</p>
          <h1 id="page-title">Every open loop.<br />One honest order.</h1>
          <p className="intro-copy">
            The board ranks what is actionable, separates what is waiting, and only
            awards the points when the source of truth says the loop is closed.
          </p>
        </div>
        <div className="score-card" aria-label="Board score">
          <div className="score-topline">
            <span>Room score</span>
            <strong>Level {data.summary.level}</strong>
          </div>
          <div className="score-number">{data.summary.xp}<span>XP</span></div>
          <div className="progress-track" aria-label={`${data.summary.completion}% complete`}>
            <span style={{ width: `${data.summary.completion}%` }} />
          </div>
          <p>{data.summary.closedThisWeek} loops closed this week. {data.summary.active} remain active.</p>
        </div>
      </section>

      {lead ? (
        <section className="decision-card" aria-labelledby="next-move-title">
          <div className="decision-kicker">
            <span>01</span>
            <p>Close this next</p>
          </div>
          <div className="decision-main">
            <div className="decision-meta">
              <span className={`state state-${lead.state}`}>{STATE_LABELS[lead.state]}</span>
              <span>{lead.area}</span>
              <span>{lead.tier} priority</span>
            </div>
            <h2 id="next-move-title">{lead.title}</h2>
            <p>{lead.reason}</p>
            <div className="decision-actions">
              <button
                type="button"
                onClick={() => void updateTask(lead.id, { state: "done" })}
                disabled={pendingId === lead.id}
              >
                {pendingId === lead.id ? "Saving…" : "Mark done"}
              </button>
              <button type="button" className="quiet" onClick={() => startEditing(lead)}>
                Edit task
              </button>
            </div>
          </div>
          <div className="decision-score">
            <span>Priority</span>
            <strong>{lead.score}</strong>
          </div>
        </section>
      ) : null}

      <section className="metrics" aria-label="Board totals">
        <Metric label="Open loops" value={data.summary.open} />
        <Metric label="Actionable" value={data.summary.active} />
        <Metric label="In motion" value={data.summary.inProgress} />
        <Metric label="Waiting" value={data.summary.waiting} />
        <Metric label="Closed" value={data.summary.closedThisWeek} />
        <Metric label="Weekly close rate" value={data.summary.completion} suffix="%" />
      </section>

      <section className="board-section" aria-labelledby="queue-title">
        <div className="board-heading">
          <div>
            <p className="eyebrow">The queue</p>
            <h2 id="queue-title">Order of priority</h2>
          </div>
          <nav className="filters" aria-label="Filter tasks">
            {FILTERS.map((item) => (
              <button
                type="button"
                key={item.id}
                className={filter === item.id ? "active" : ""}
                onClick={() => setFilter(item.id)}
                aria-pressed={filter === item.id}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {notice ? <div className="board-notice" role="status">{notice}</div> : null}

        <div className="task-list">
          {visibleTasks.length ? visibleTasks.map((task, index) => (
            <article id={`task-${task.id}`} className={`task-row task-${task.state}`} key={task.id}>
              <div className="task-rank">
                {filter === "priority" ? String(index + 1).padStart(2, "0") : "·"}
              </div>
              <div className="task-body">
                <div className="task-meta">
                  <span>{task.area}</span>
                  <span className={`state state-${task.state}`}>{STATE_LABELS[task.state]}</span>
                  {task.id.startsWith("HWL-") ? <span>{task.id}</span> : null}
                </div>
                {editingId === task.id ? (
                  <form className="task-edit" onSubmit={(event) => submitEdit(event, task)}>
                    <label htmlFor={`title-${task.id}`}>Task</label>
                    <input
                      id={`title-${task.id}`}
                      value={draftTitle}
                      maxLength={280}
                      onChange={(event) => setDraftTitle(event.target.value)}
                      autoFocus
                    />
                    <div>
                      <button type="submit" disabled={pendingId === task.id}>Save</button>
                      <button
                        type="button"
                        className="quiet"
                        onClick={() => setEditingId(null)}
                        disabled={pendingId === task.id}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h3>{task.title}</h3>
                    <p>{task.reason}</p>
                  </>
                )}
              </div>
              <div className="task-side">
                <div className="task-score" aria-label={`Priority score ${task.score}`}>
                  <span>{task.tier}</span>
                  <strong>{task.score}</strong>
                </div>
                {isEditableTask(task) ? (
                  <div className="task-actions">
                    <button
                      type="button"
                      onClick={() => void updateTask(task.id, {
                        state: task.state === "done" ? "todo" : "done",
                      })}
                      disabled={pendingId === task.id}
                    >
                      {pendingId === task.id
                        ? "Saving…"
                        : task.state === "done" ? "Reopen" : "Done"}
                    </button>
                    <button type="button" className="quiet" onClick={() => startEditing(task)}>
                      Edit
                    </button>
                  </div>
                ) : null}
              </div>
            </article>
          )) : (
            <div className="empty-state">Nothing in this room.</div>
          )}
        </div>
      </section>

      <footer>
        <span>Edits sync into the nightly source</span>
        <span>Generated {new Date(data.generatedAt).toLocaleString("en-GB", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Europe/London",
        })}</span>
      </footer>
    </main>
  );
}
