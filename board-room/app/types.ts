export type TaskState =
  | "todo"
  | "in-progress"
  | "waiting"
  | "scheduled"
  | "parked"
  | "done";

export type BoardTask = {
  id: string;
  title: string;
  area: string;
  state: TaskState;
  baseScore: number;
  score: number;
  tier: "Critical" | "High" | "Next" | "Later" | "Closed";
  reason: string;
  due: string | null;
  rank: number | null;
};

export type BoardData = {
  title: string;
  week: string;
  sourceDate: string;
  generatedAt: string;
  sourceCommit: string;
  summary: {
    open: number;
    active: number;
    inProgress: number;
    waiting: number;
    scheduled: number;
    parked: number;
    closedThisWeek: number;
    completion: number;
    xp: number;
    level: number;
  };
  tasks: BoardTask[];
};

export type BoardEvent = {
  version: 1;
  id: string;
  title?: string;
  state?: "todo" | "done";
  updatedAt: string;
};
