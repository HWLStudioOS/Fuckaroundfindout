import type { ReactNode } from "react";

// Feed summaries arrive as plain text carrying artefacts from the source:
// space-padded *emphasis*, bare URLs, and whitespace the Acast editor lost
// (glued bullets like "back- Building", sentences like "everyone.Get", and
// handles like "@betteratworkpodOr"). They are repaired at render time so the
// canonical Acast snapshot stays byte-identical to the feed.
const URL_PATTERN = /https?:\/\/[^\s)]+|www\.[^\s)]+/g;

export function cleanFeedText(text: string): string {
  return text
    .replace(/([a-z’”"):])- (?=[A-Z‘“"@])/g, "$1\n\n- ")
    .replace(/([a-z])\.(?=[A-Z])/g, "$1. ")
    .replace(/(@[a-z0-9_]{3,})(?=[A-Z][a-z])/g, "$1 ")
    .replace(/(\p{Extended_Pictographic})(?=[A-Za-z])/gu, "$1 ");
}

function linkify(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(URL_PATTERN)) {
    const index = match.index ?? 0;
    let url = match[0].replace(/[.,;:]+$/, "");
    // A capitalised bare word after the final slash is glued prose, not path:
    // "…cathal-quinlan/And get" links "…cathal-quinlan/" and keeps "And get".
    const glued = url.match(/\/([A-Z][a-z]+)$/);
    if (glued) url = url.slice(0, url.length - glued[1].length);
    if (index > last) nodes.push(text.slice(last, index));
    const href = url.startsWith("www.") ? `https://${url}` : url;
    nodes.push(
      <a key={`${keyPrefix}-${index}`} href={href} target="_blank" rel="noreferrer">
        {url.replace(/^https?:\/\/(www\.)?/, "")}
      </a>,
    );
    last = index + url.length;
    if (glued) nodes.push(" ");
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function NotesParagraph({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  const parts = text.split(/\*\s*([^*\n]+?)\s*\*/g);
  parts.forEach((part, index) => {
    if (!part) return;
    if (index % 2 === 1) {
      nodes.push(<em key={`em-${index}`}>{part}</em>);
    } else {
      nodes.push(...linkify(part, `text-${index}`));
    }
  });
  return <p>{nodes}</p>;
}
