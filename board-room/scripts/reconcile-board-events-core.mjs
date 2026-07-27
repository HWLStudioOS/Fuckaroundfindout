export function reconcileBoardText(boardText, events) {
  const latestByTask = new Map();
  for (const event of events) {
    const current = latestByTask.get(event.id);
    if (!current || event.updatedAt > current.updatedAt) latestByTask.set(event.id, event);
  }

  const lines = boardText.split("\n");
  const settledTaskIds = [];
  let applied = 0;

  for (const [id, event] of latestByTask) {
    if (!/^HWL-\d+$/.test(id)) continue;
    const marker = `<!-- linear:${id} -->`;
    const lineIndex = lines.findIndex((line) => line.includes(marker));
    if (lineIndex === -1) continue;

    const match = lines[lineIndex].match(/^(\s*-\s+\[)([ xX])(\]\s+)(.*?)(\s+<!--\s*linear:[^>]+-->\s*)$/);
    if (!match) continue;

    const currentState = match[2].toLowerCase() === "x" ? "done" : "todo";
    const desiredState = event.state ?? currentState;
    const desiredTitle = event.title ?? match[4].trim();
    if (!desiredTitle || desiredTitle.length > 280 || /<!--|-->|[\r\n\u0000-\u001f]/.test(desiredTitle)) continue;

    if (currentState === desiredState && match[4].trim() === desiredTitle) {
      settledTaskIds.push(id);
      continue;
    }

    lines[lineIndex] = `${match[1]}${desiredState === "done" ? "x" : " "}${match[3]}${desiredTitle}${match[5]}`;
    applied += 1;
  }

  return { text: lines.join("\n"), applied, settledTaskIds };
}
