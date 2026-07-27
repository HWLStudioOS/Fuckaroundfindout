import { get, list, put } from "@vercel/blob";
import type { BoardEvent } from "./types";

const EVENT_PREFIX = "board-room-events/";

function token() {
  const value = process.env.BLOB_READ_WRITE_TOKEN;
  if (!value) throw new Error("Board Room storage is not configured.");
  return value;
}

export async function readBoardEvents(): Promise<BoardEvent[]> {
  const blobs: Awaited<ReturnType<typeof list>>["blobs"] = [];
  let cursor: string | undefined;
  do {
    const result = await list({
      prefix: EVENT_PREFIX,
      limit: 1000,
      cursor,
      token: token(),
    });
    blobs.push(...result.blobs);
    cursor = result.hasMore ? result.cursor : undefined;
  } while (cursor);

  const events = await Promise.all(blobs.map(async (blob) => {
    const stored = await get(blob.pathname, {
      access: "private",
      token: token(),
    });
    if (stored?.statusCode !== 200 || !stored.stream) return null;
    const body = await new Response(stored.stream).text();
    return JSON.parse(body) as BoardEvent;
  }));

  return events.filter((event): event is BoardEvent => Boolean(event));
}

export async function writeBoardEvent(event: BoardEvent) {
  const pathname = `${EVENT_PREFIX}${Date.now()}-${crypto.randomUUID()}.json`;
  await put(pathname, JSON.stringify(event), {
    access: "private",
    addRandomSuffix: false,
    contentType: "application/json",
    cacheControlMaxAge: 60,
    token: token(),
  });
}
