import { NextRequest, NextResponse } from "next/server";
import initialBoard from "../../generated-board.json";
import { readBoardEvents, writeBoardEvent } from "../../board-events";
import { mergeBoardEvents } from "../../board-state";
import type { BoardData, BoardEvent } from "../../types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const source = initialBoard as BoardData;

function privateJson(value: unknown, status = 200) {
  return NextResponse.json(value, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}

function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    const events = await readBoardEvents();
    return privateJson(mergeBoardEvents(source, events));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Board state could not be loaded.";
    return privateJson({ error: message }, 503);
  }
}

export async function PATCH(request: NextRequest) {
  if (!isSameOrigin(request)) return privateJson({ error: "Cross-origin writes are not allowed." }, 403);
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return privateJson({ error: "Expected JSON." }, 415);
  }

  let body: { id?: unknown; title?: unknown; state?: unknown };
  try {
    body = await request.json();
  } catch {
    return privateJson({ error: "Invalid JSON." }, 400);
  }

  if (typeof body.id !== "string" || !body.id.startsWith("HWL-")) {
    return privateJson({ error: "Only active board tasks can be changed here." }, 400);
  }

  const task = source.tasks.find((candidate) => candidate.id === body.id);
  if (!task) return privateJson({ error: "Task not found." }, 404);

  const event: BoardEvent = {
    version: 1,
    id: body.id,
    updatedAt: new Date().toISOString(),
  };

  if (body.state !== undefined) {
    if (body.state !== "todo" && body.state !== "done") {
      return privateJson({ error: "State must be todo or done." }, 400);
    }
    event.state = body.state;
  }

  if (body.title !== undefined) {
    if (typeof body.title !== "string") return privateJson({ error: "Title must be text." }, 400);
    const title = body.title.replace(/\s+/g, " ").trim();
    if (!title || title.length > 280 || /<!--|-->|[\r\n\u0000-\u001f]/.test(body.title)) {
      return privateJson({ error: "Use a single-line title between 1 and 280 characters." }, 400);
    }
    event.title = title;
  }

  if (event.state === undefined && event.title === undefined) {
    return privateJson({ error: "No change supplied." }, 400);
  }

  try {
    await writeBoardEvent(event);
    const events = await readBoardEvents();
    return privateJson(mergeBoardEvents(source, events));
  } catch (error) {
    const message = error instanceof Error ? error.message : "The change could not be saved.";
    return privateJson({ error: message }, 503);
  }
}
