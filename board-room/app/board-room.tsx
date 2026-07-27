"use client";

import { useMemo, useState } from "react";
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

export function BoardRoom({ data }: { data: BoardData }) {
  const [filter, setFilter] = useState<Filter>("priority");
  const visibleTasks = useMemo(
    () => tasksForFilter(data.tasks, filter),
    [data.tasks, filter],
  );
  const lead = data.tasks.find(
    (task) => task.state === "in-progress" || task.state === "todo",
  );

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

        <div className="task-list">
          {visibleTasks.length ? visibleTasks.map((task, index) => (
            <article className={`task-row task-${task.state}`} key={task.id}>
              <div className="task-rank">
                {filter === "priority" ? String(index + 1).padStart(2, "0") : "·"}
              </div>
              <div className="task-body">
                <div className="task-meta">
                  <span>{task.area}</span>
                  <span className={`state state-${task.state}`}>{STATE_LABELS[task.state]}</span>
                  {task.id.startsWith("HWL-") ? <span>{task.id}</span> : null}
                </div>
                <h3>{task.title}</h3>
                <p>{task.reason}</p>
              </div>
              <div className="task-score" aria-label={`Priority score ${task.score}`}>
                <span>{task.tier}</span>
                <strong>{task.score}</strong>
              </div>
            </article>
          )) : (
            <div className="empty-state">Nothing in this room.</div>
          )}
        </div>
      </section>

      <footer>
        <span>Read-only by design</span>
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
