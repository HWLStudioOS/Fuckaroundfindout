import type { BoardData, BoardEvent, BoardTask } from "./types";

const ACTIVE_STATES = new Set(["todo", "in-progress"]);
const STATE_ORDER: Record<BoardTask["state"], number> = {
  "in-progress": 0,
  todo: 1,
  waiting: 2,
  scheduled: 3,
  parked: 4,
  done: 5,
};

function tierFor(score: number, state: BoardTask["state"]): BoardTask["tier"] {
  if (state === "done") return "Closed";
  if (score >= 90) return "Critical";
  if (score >= 75) return "High";
  if (score >= 55) return "Next";
  return "Later";
}

export function mergeBoardEvents(source: BoardData, events: BoardEvent[]): BoardData {
  const latestById = new Map<string, BoardEvent>();

  for (const event of events) {
    const current = latestById.get(event.id);
    if (!current || event.updatedAt > current.updatedAt) latestById.set(event.id, event);
  }

  const tasks = source.tasks.map((sourceTask) => {
    const task = { ...sourceTask };
    const event = latestById.get(task.id);
    if (event?.title) task.title = event.title;
    if (event?.state && task.id.startsWith("HWL-")) task.state = event.state;
    task.score = task.state === "done" ? 0 : task.baseScore;
    task.tier = tierFor(task.score, task.state);
    task.rank = null;
    return task;
  });

  const active = tasks
    .filter((task) => ACTIVE_STATES.has(task.state))
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
  active.forEach((task, index) => { task.rank = index + 1; });

  tasks.sort((a, b) => {
    const aActive = ACTIVE_STATES.has(a.state);
    const bActive = ACTIVE_STATES.has(b.state);
    if (aActive && bActive) return b.score - a.score || a.title.localeCompare(b.title);
    if (aActive) return -1;
    if (bActive) return 1;
    return STATE_ORDER[a.state] - STATE_ORDER[b.state] || b.score - a.score;
  });

  const closedThisWeek = tasks.filter((task) => task.state === "done").length;
  const weeklyTotal = active.length + closedThisWeek;
  const inProgress = tasks.filter((task) => task.state === "in-progress").length;

  return {
    ...source,
    generatedAt: events.length
      ? events.reduce((latest, event) => event.updatedAt > latest ? event.updatedAt : latest, source.generatedAt)
      : source.generatedAt,
    summary: {
      open: tasks.filter((task) => task.state !== "done").length,
      active: active.length,
      inProgress,
      waiting: tasks.filter((task) => task.state === "waiting").length,
      scheduled: tasks.filter((task) => task.state === "scheduled").length,
      parked: tasks.filter((task) => task.state === "parked").length,
      closedThisWeek,
      completion: weeklyTotal ? Math.round((closedThisWeek / weeklyTotal) * 100) : 100,
      xp: closedThisWeek * 120 + inProgress * 25,
      level: Math.floor((closedThisWeek * 120 + inProgress * 25) / 500) + 1,
    },
    tasks,
  };
}
