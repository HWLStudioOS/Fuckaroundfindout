function cleanTitle(value) {
  return value
    .replace(/<!--\s*linear:[^>]+-->/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function slug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48);
}

function findTaskLine(lines, id, event) {
  if (/^HWL-\d+$/.test(id)) {
    const marker = `<!-- linear:${id} -->`;
    return lines.findIndex((line) => line.includes(marker));
  }

  if (!id.startsWith("active-")) return -1;
  const lineIndex = lines.findIndex((line) => {
    const match = line.match(/^\s*-\s+\[[ xX]\]\s+(.+)$/);
    return match && `active-${slug(cleanTitle(match[1]))}` === id;
  });
  if (lineIndex !== -1 || !event.title) return lineIndex;

  const desiredTitle = cleanTitle(event.title);
  return lines.findIndex((line) => {
    const match = line.match(/^\s*-\s+\[[ xX]\]\s+(.+)$/);
    return match && cleanTitle(match[1]) === desiredTitle;
  });
}

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
    const lineIndex = findTaskLine(lines, id, event);
    if (lineIndex === -1) continue;

    const match = lines[lineIndex].match(/^(\s*-\s+\[)([ xX])(\]\s+)(.*?)(\s+<!--\s*linear:[^>]+-->\s*)?$/);
    if (!match) continue;

    const currentState = match[2].toLowerCase() === "x" ? "done" : "todo";
    const desiredState = event.state ?? currentState;
    const desiredTitle = event.title ?? match[4].trim();
    if (!desiredTitle || desiredTitle.length > 280 || /<!--|-->|[\r\n\u0000-\u001f]/.test(desiredTitle)) continue;

    if (currentState === desiredState && match[4].trim() === desiredTitle) {
      settledTaskIds.push(id);
      continue;
    }

    lines[lineIndex] = `${match[1]}${desiredState === "done" ? "x" : " "}${match[3]}${desiredTitle}${match[5] ?? ""}`;
    applied += 1;
  }

  return { text: lines.join("\n"), applied, settledTaskIds };
}
