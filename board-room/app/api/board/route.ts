import { NextRequest, NextResponse } from "next/server.js";
import initialBoard from "../../generated-board.json" with { type: "json" };
import { readBoardEvents, writeBoardEvent } from "../../board-events.ts";
import { isEditableTask, mergeBoardEvents } from "../../board-state.ts";
import {
  applyBoardSecurityHeaders,
  isTrustedMutationOrigin,
} from "../../../security.ts";
import type { BoardData, BoardEvent } from "../../types.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const source = initialBoard as BoardData;
const MAX_MUTATION_BYTES = 4096;

class MutationBodyTooLargeError extends Error {}

async function readBoundedMutationBody(request: NextRequest) {
  const reader = request.body?.getReader();
  if (!reader) return "";

  const decoder = new TextDecoder("utf-8", { fatal: true });
  let bytes = 0;
  let body = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > MAX_MUTATION_BYTES) {
      await reader.cancel();
      throw new MutationBodyTooLargeError();
    }
    body += decoder.decode(value, { stream: true });
  }

  return body + decoder.decode();
}

function privateJson(request: NextRequest, value: unknown, status = 200) {
  const response = NextResponse.json(value, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
  return applyBoardSecurityHeaders(response, request.nextUrl.origin);
}

export async function GET(request: NextRequest) {
  try {
    const events = await readBoardEvents();
    return privateJson(request, mergeBoardEvents(source, events));
  } catch (error) {
    console.error("[board-room] Board state read failed.", error instanceof Error ? error.name : "UnknownError");
    return privateJson(request, { error: "Board state could not be loaded." }, 503);
  }
}

export async function PATCH(request: NextRequest) {
  if (!isTrustedMutationOrigin(request)) {
    return privateJson(request, { error: "A valid same-origin request is required." }, 403);
  }

  const contentType = request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();
  if (contentType !== "application/json") {
    return privateJson(request, { error: "Expected JSON." }, 415);
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_MUTATION_BYTES) {
    return privateJson(request, { error: "Request is too large." }, 413);
  }

  let rawBody: string;
  try {
    rawBody = await readBoundedMutationBody(request);
  } catch (error) {
    if (error instanceof MutationBodyTooLargeError) {
      return privateJson(request, { error: "Request is too large." }, 413);
    }
    return privateJson(request, { error: "Invalid JSON." }, 400);
  }

  let parsedBody: unknown;
  try {
    parsedBody = JSON.parse(rawBody);
  } catch {
    return privateJson(request, { error: "Invalid JSON." }, 400);
  }

  if (!parsedBody || typeof parsedBody !== "object" || Array.isArray(parsedBody)) {
    return privateJson(request, { error: "Expected a JSON object." }, 400);
  }
  const body = parsedBody as { id?: unknown; title?: unknown; state?: unknown };

  if (typeof body.id !== "string") {
    return privateJson(request, { error: "Only active board tasks can be changed here." }, 400);
  }

  const task = source.tasks.find((candidate) => candidate.id === body.id);
  if (!task) return privateJson(request, { error: "Task not found." }, 404);
  if (!isEditableTask(task)) {
    return privateJson(request, { error: "Only active board tasks can be changed here." }, 400);
  }

  const event: BoardEvent = {
    version: 1,
    id: body.id,
    updatedAt: new Date().toISOString(),
  };

  if (body.state !== undefined) {
    if (body.state !== "todo" && body.state !== "done") {
      return privateJson(request, { error: "State must be todo or done." }, 400);
    }
    event.state = body.state;
  }

  if (body.title !== undefined) {
    if (typeof body.title !== "string") {
      return privateJson(request, { error: "Title must be text." }, 400);
    }
    const title = body.title.replace(/\s+/g, " ").trim();
    if (!title || title.length > 280 || /<!--|-->|[\r\n\u0000-\u001f]/.test(body.title)) {
      return privateJson(
        request,
        { error: "Use a single-line title between 1 and 280 characters." },
        400,
      );
    }
    event.title = title;
  }

  if (event.state === undefined && event.title === undefined) {
    return privateJson(request, { error: "No change supplied." }, 400);
  }

  try {
    await writeBoardEvent(event);
    const events = await readBoardEvents();
    return privateJson(request, mergeBoardEvents(source, events));
  } catch (error) {
    console.error("[board-room] Board mutation failed.", error instanceof Error ? error.name : "UnknownError");
    return privateJson(request, { error: "The change could not be saved." }, 503);
  }
}
