import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const FEED_URL =
  process.env.ACAST_FEED_URL ??
  "https://feeds.acast.com/public/shows/69d60ca52a193257adc683b0";

const outputUrl = new URL("../src/data/acast-episodes.json", import.meta.url);

const decodeEntities = (value) =>
  value.replace(
    /&(#x[0-9a-f]+|#\d+|amp|apos|gt|lt|nbsp|quot);/gi,
    (entity, code) => {
      if (code[0] === "#") {
        const radix = code[1].toLowerCase() === "x" ? 16 : 10;
        const number = Number.parseInt(code.slice(radix === 16 ? 2 : 1), radix);
        return Number.isFinite(number) ? String.fromCodePoint(number) : entity;
      }

      return {
        amp: "&",
        apos: "'",
        gt: ">",
        lt: "<",
        nbsp: " ",
        quot: '"',
      }[code.toLowerCase()];
    },
  );

const unwrap = (value = "") =>
  decodeEntities(value.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim());

const readTag = (xml, name) => {
  const escaped = name.replace(":", "\\:");
  return unwrap(
    xml.match(new RegExp(`<${escaped}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escaped}>`, "i"))?.[1],
  );
};

const readAttribute = (xml, name, attribute) => {
  const escaped = name.replace(":", "\\:");
  return unwrap(
    xml.match(
      new RegExp(`<${escaped}(?:\\s[^>]*)?\\s${attribute}=["']([^"']+)["'][^>]*>`, "i"),
    )?.[1],
  );
};

const htmlToText = (html) => {
  const text = decodeEntities(
    html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<br\s*\/?\s*>/gi, "\n")
      .replace(/<\/p\s*>/gi, "\n")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\r/g, "")
    .replace(/\s*Hosted on Acast\.\s*See\s+acast\.com\/privacy\s+for more information\.\s*/gi, " ")
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .filter((line) => !/^hosted on acast\b/i.test(line))
    .join("\n\n")
    .trim();

  return text.slice(0, 2400);
};

const durationToSeconds = (duration) => {
  const parts = duration
    .split(":")
    .map((part) => Number.parseInt(part, 10))
    .filter(Number.isFinite);

  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 1) return parts[0];
  return 0;
};

const slugify = (value) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 96);

const response = await fetch(FEED_URL, {
  headers: {
    accept: "application/rss+xml, application/xml;q=0.9, text/xml;q=0.8",
    "user-agent": "BetterAtWorkArchiveSync/1.0",
  },
});

if (!response.ok) {
  throw new Error(`Acast feed returned ${response.status} ${response.statusText}`);
}

const xml = await response.text();
const itemBlocks = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map(
  (match) => match[1],
);

if (!itemBlocks.length) {
  throw new Error("Acast feed contained no episode items");
}

const episodes = itemBlocks
  .map((item) => {
    const title = readTag(item, "itunes:title") || readTag(item, "title");
    const acastUrl = readTag(item, "link");
    const feedSlug = readTag(item, "acast:episodeUrl");
    const publishedAt = new Date(readTag(item, "pubDate"));
    const duration = readTag(item, "itunes:duration");

    if (!title || !acastUrl || Number.isNaN(publishedAt.getTime())) return null;

    return {
      id: readTag(item, "acast:episodeId") || readTag(item, "guid"),
      slug: feedSlug || slugify(title),
      title,
      publishedAt: publishedAt.toISOString(),
      duration,
      durationSeconds: durationToSeconds(duration),
      summary: htmlToText(readTag(item, "description") || readTag(item, "itunes:summary")),
      audioUrl: readAttribute(item, "enclosure", "url"),
      acastUrl,
      imageUrl: readAttribute(item, "itunes:image", "href"),
      episodeType: readTag(item, "itunes:episodeType") || "full",
    };
  })
  .filter(Boolean)
  .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));

const duplicateSlugs = episodes
  .map((episode) => episode.slug)
  .filter((slug, index, all) => all.indexOf(slug) !== index);

if (duplicateSlugs.length) {
  throw new Error(`Duplicate Acast episode slugs: ${[...new Set(duplicateSlugs)].join(", ")}`);
}

const payload = {
  source: FEED_URL,
  syncedAt: new Date().toISOString(),
  count: episodes.length,
  episodes,
};

await mkdir(new URL("../src/data/", import.meta.url), { recursive: true });
await writeFile(outputUrl, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

console.log(`Wrote ${episodes.length} episodes to ${fileURLToPath(outputUrl)}`);
