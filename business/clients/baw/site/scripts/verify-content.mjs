import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";

const archiveUrl = new URL("../src/data/acast-episodes.json", import.meta.url);
const archive = JSON.parse(await readFile(archiveUrl, "utf8"));

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

assert(
  archive.source === "https://feeds.acast.com/public/shows/69d60ca52a193257adc683b0",
  "Archive source is not the canonical Better at Work Acast feed",
);
assert(archive.count === archive.episodes.length, "Archive count does not match episode data");
assert(archive.episodes.length >= 80, "Archive snapshot is unexpectedly small");

const ids = new Set();
const slugs = new Set();
for (const episode of archive.episodes) {
  assert(episode.id, `Episode is missing an id: ${episode.title}`);
  assert(!ids.has(episode.id), `Duplicate episode id: ${episode.id}`);
  ids.add(episode.id);

  assert(episode.slug, `Episode is missing a slug: ${episode.title}`);
  assert(!slugs.has(episode.slug), `Duplicate episode slug: ${episode.slug}`);
  slugs.add(episode.slug);

  assert(episode.title, `Episode ${episode.id} is missing a title`);
  assert(!Number.isNaN(Date.parse(episode.publishedAt)), `Invalid date: ${episode.title}`);
  assert(episode.audioUrl.startsWith("https://"), `Invalid audio URL: ${episode.title}`);
  assert(episode.acastUrl.startsWith("https://"), `Invalid source URL: ${episode.title}`);
}

const pdfUrl = new URL("../public/resources/roger-martin-sum-up.pdf", import.meta.url);
const transcriptUrl = new URL(
  "../public/transcripts/helen-tupper-s4e01.txt",
  import.meta.url,
);
const logoUrl = new URL("../public/assets/better-at-work-logo.svg", import.meta.url);
const socialPreviewUrl = new URL("../src/app/opengraph-image.tsx", import.meta.url);
const [pdfStats, transcript, logo, socialPreview] = await Promise.all([
  stat(pdfUrl),
  readFile(transcriptUrl, "utf8"),
  readFile(logoUrl, "utf8"),
  readFile(socialPreviewUrl, "utf8"),
]);

assert(pdfStats.size > 1_000_000, "Roger Martin Sum Up PDF is missing or truncated");
assert(
  transcript.startsWith("[00:00:00]") && transcript.length > 50_000,
  "Helen Tupper transcript is missing or truncated",
);
assert(
  createHash("sha256").update(logo.trimEnd()).digest("hex") ===
    "d096bd164e714c784289dba52fe096b958a1b04016d0d8f9464879fcadabe65c",
  "Better at Work logo no longer matches the approved original vector",
);
assert(
  socialPreview.includes("better-at-work-logo.svg") &&
    socialPreview.includes("width: 1200") &&
    socialPreview.includes("height: 630"),
  "Open Graph image must use the approved logo at 1200 x 630",
);

console.log(
  `Verified ${archive.episodes.length} canonical episodes, one transcript, one Sum Up PDF, the approved logo and its social preview`,
);
