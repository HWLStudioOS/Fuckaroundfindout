import { BoardRoom } from "./board-room";
import boardData from "./generated-board.json";
import type { BoardData } from "./types";

export const dynamic = "force-static";

export default function Home() {
  return <BoardRoom data={boardData as BoardData} />;
}
