import acastArchive from "@/data/acast-episodes.json";

export const ACAST_FEED_URL = acastArchive.source;

export type Accent = "yellow" | "violet" | "coral" | "green" | "blue";
export type TopicSlug =
  | "leadership"
  | "career-change"
  | "teams-and-culture"
  | "energy-and-burnout";

export type EpisodeUtility = {
  href: string;
  label: string;
};

export type Episode = {
  id: string;
  slug: string;
  series: string;
  number: string;
  title: string;
  shortTitle: string;
  guest: string;
  date: string;
  publishedAt: string;
  duration: string;
  durationSeconds: number;
  summary: string;
  excerpt: string;
  showNotes: string;
  audioUrl: string;
  acastUrl: string;
  imageUrl?: string;
  accent: Accent;
  topics: string[];
  topicSlugs: TopicSlug[];
  problems: string[];
  takeaways: string[];
  moments: { time: string; label: string }[];
  quote?: string;
  transcript?: EpisodeUtility;
  resource?: EpisodeUtility;
  curated: boolean;
};

type CuratedEpisode = Omit<
  Episode,
  | "id"
  | "durationSeconds"
  | "excerpt"
  | "showNotes"
  | "imageUrl"
  | "topicSlugs"
  | "transcript"
  | "resource"
  | "curated"
>;

const curatedEpisodes: CuratedEpisode[] = [
  {
    slug: "season-four-lessons-that-changed-how-we-work",
    series: "Season 4 finale",
    number: "S4 E35",
    title: "The best workplace advice from 30 episodes",
    shortTitle: "Four ideas that changed how we work",
    guest: "Cathal Quinlan & Annette Sloan",
    date: "9 July 2026",
    publishedAt: "2026-07-09T06:00:00.000Z",
    duration: "36 min",
    summary:
      "Cathal and Annette close out the season together in London and test the four ideas that actually changed how they work.",
    audioUrl:
      "https://sphinx.acast.com/p/open/s/69d60ca52a193257adc683b0/e/6a4e32f8f8a80edf85cb2e26/media.mp3",
    acastUrl:
      "https://shows.acast.com/betteratworkpodcast/episodes/the-best-workplace-advice-from-30-episodes-better-at-work-se",
    accent: "yellow",
    topics: ["Leadership", "Careers", "Teams"],
    problems: [
      "I need a useful place to start",
      "I feel stuck at work",
      "My team lacks clarity",
      "I want the best ideas from the season",
    ],
    takeaways: [
      "A fulfilling career needs contribution, connection, choice and challenge.",
      "People do better work when they know that they matter.",
      "Clarity is a team practice, not a leader's announcement.",
    ],
    moments: [
      { time: "02:18", label: "The four ideas that survived the season" },
      { time: "11:42", label: "Why mattering changes performance" },
      { time: "24:06", label: "The conflict framework worth keeping" },
    ],
  },
  {
    slug: "why-planning-isnt-strategy-roger-martin",
    series: "Guest conversation",
    number: "S4 E32",
    title: "Why planning isn't strategy",
    shortTitle: "Why planning isn't strategy",
    guest: "Roger L. Martin",
    date: "18 June 2026",
    publishedAt: "2026-06-18T06:00:00.000Z",
    duration: "47 min",
    summary:
      "The world's leading strategy thinker dismantles the planning document, the laundry list and the myth that leaders make choices while everyone else executes.",
    audioUrl:
      "https://sphinx.acast.com/p/open/s/69d60ca52a193257adc683b0/e/6a32d1ae5926b9ca34a98bc6/media.mp3",
    acastUrl:
      "https://shows.acast.com/betteratworkpodcast/episodes/the-worlds-1-strategy-thinker-on-why-planning-isnt-strategy",
    accent: "violet",
    topics: ["Strategy", "Leadership", "Decisions"],
    problems: [
      "We have too many priorities",
      "Our strategy is just a plan",
      "My team is waiting for direction",
      "I need to make a hard choice",
      "AI keeps giving me average ideas",
    ],
    takeaways: [
      "Strategy is a connected set of choices that compels someone to act.",
      "The currency of planning is initiatives. The currency of strategy is choices.",
      "Manage the outcome and let capable people determine the route.",
    ],
    moments: [
      { time: "03:35", label: "The kitchen-table lesson Harvard could not teach" },
      { time: "11:36", label: "Strategy is what you do, not what you say" },
      { time: "22:16", label: "Planning has initiatives. Strategy has choices" },
      { time: "40:10", label: "Manage outputs, not inputs" },
    ],
    quote: "Strategy is what you do, not what you say.",
  },
  {
    slug: "what-ai-cant-do-for-your-strategy",
    series: "Guest conversation",
    number: "S4 E33",
    title: "What AI can't do for your strategy",
    shortTitle: "AI gives you the average, not the edge",
    guest: "Roger L. Martin",
    date: "25 June 2026",
    publishedAt: "2026-06-25T06:00:00.000Z",
    duration: "48 min",
    summary:
      "Roger Martin explains the four-word question he uses in boardrooms and why a mode-seeking machine cannot make a distinctive strategic choice for you.",
    audioUrl:
      "https://sphinx.acast.com/p/open/s/69d60ca52a193257adc683b0/e/6a3c32795bb8a79968e3541a/media.mp3",
    acastUrl:
      "https://shows.acast.com/betteratworkpodcast/episodes/part-2-the-worlds-1-strategy-thinker-on-why-planning-isnt-st",
    accent: "coral",
    topics: ["AI", "Strategy", "Decisions"],
    problems: [
      "AI keeps giving me average ideas",
      "I need a better decision question",
      "Our strategy is not distinctive",
      "I am too busy to think",
    ],
    takeaways: [
      "Ask what would have to be true before arguing over what is true.",
      "AI is excellent at finding the middle of the distribution.",
      "A strategy that looks like everyone else's is not worth having.",
    ],
    moments: [
      { time: "00:24", label: "What would have to be true?" },
      { time: "18:19", label: "Capabilities are the reality check" },
      { time: "31:44", label: "Why AI finds the average" },
      { time: "43:02", label: "Helpful and clever are different things" },
    ],
    quote: "If everybody else is doing it, it is not a distinctive strategy.",
  },
  {
    slug: "why-your-office-feels-wrong",
    series: "Listener questions",
    number: "S4 E31",
    title: "Why your office feels wrong",
    shortTitle: "The three needs every workspace must meet",
    guest: "Cathal Quinlan & Annette Sloan",
    date: "11 June 2026",
    publishedAt: "2026-06-11T06:00:00.000Z",
    duration: "30 min",
    summary:
      "Agency, growth and connection explain more about a workplace than paint colour, hot desks or the number of days people come in.",
    audioUrl:
      "https://sphinx.acast.com/p/open/s/69d60ca52a193257adc683b0/e/6a29c8d54df224c1a487b152/media.mp3",
    acastUrl:
      "https://shows.acast.com/betteratworkpodcast/episodes/listener-questions-why-your-office-feels-wrong-helping-a-par",
    accent: "blue",
    topics: ["Workplace", "Energy", "Relationships"],
    problems: [
      "Our office drains me",
      "Hot desking is hurting the team",
      "My partner cannot stop working",
      "I feel disconnected at work",
    ],
    takeaways: [
      "A useful workspace gives people agency, growth and connection.",
      "Visiting a room before a difficult meeting can reduce the cognitive load.",
      "Helping someone who is overworking begins with connection, not fixing.",
    ],
    moments: [
      { time: "03:18", label: "Agency, growth and connection" },
      { time: "10:46", label: "The simplest confidence trick" },
      { time: "17:22", label: "When someone says they have no choice" },
    ],
  },
  {
    slug: "the-three-things-every-office-steals",
    series: "Guest conversation",
    number: "S4 E30",
    title: "The three things every office steals from you",
    shortTitle: "Design a place that helps people thrive",
    guest: "Leidy Klotz",
    date: "28 May 2026",
    publishedAt: "2026-05-28T06:00:00.000Z",
    duration: "52 min",
    summary:
      "Behavioural scientist Leidy Klotz explains how our surroundings feed or starve agency, growth and connection.",
    audioUrl:
      "https://sphinx.acast.com/p/open/s/69d60ca52a193257adc683b0/e/6a17361e942fd18754c37842/media.mp3",
    acastUrl:
      "https://shows.acast.com/betteratworkpodcast/episodes/the-3-things-every-office-steals-from-you-leidy-klotz",
    accent: "green",
    topics: ["Workplace", "Teams", "Wellbeing"],
    problems: [
      "Our office drains me",
      "I cannot change the whole workplace",
      "My team has no control",
      "Meetings make me anxious",
    ],
    takeaways: [
      "Control over a space can matter more than the finish of the space.",
      "The best workplace change may be smaller than a renovation.",
      "Arriving early changes how confidently we negotiate.",
    ],
    moments: [
      { time: "07:10", label: "The nursing-home study that changed the question" },
      { time: "19:34", label: "Why half-finished homes can help" },
      { time: "38:16", label: "The meeting-room mistake" },
    ],
  },
  {
    slug: "stop-starting-start-finishing",
    series: "Listener questions",
    number: "S4 E29",
    title: "Why doing everything means you finish nothing",
    shortTitle: "Stop starting. Start finishing.",
    guest: "Cathal Quinlan & Annette Sloan",
    date: "21 May 2026",
    publishedAt: "2026-05-21T06:00:00.000Z",
    duration: "33 min",
    summary:
      "A practical conversation about competing priorities, both-and thinking and preparing for a competency-based interview.",
    audioUrl:
      "https://sphinx.acast.com/p/open/s/69d60ca52a193257adc683b0/e/6a0da7274ac10787483e6b88/media.mp3",
    acastUrl:
      "https://shows.acast.com/betteratworkpodcast/episodes/why-doing-everything-at-work-means-you-finish-nothing-listen",
    accent: "yellow",
    topics: ["Priorities", "Careers", "Complexity"],
    problems: [
      "We have too many priorities",
      "I start everything and finish nothing",
      "I am preparing for an interview",
      "I am stuck between two good options",
    ],
    takeaways: [
      "Complexity can create energy when it is framed as both-and rather than either-or.",
      "Accumulated priorities make everything urgent and nothing finishable.",
      "Prepare five career stories and practise them aloud before the interview.",
    ],
    moments: [
      { time: "04:40", label: "The tightrope walker and the mule" },
      { time: "14:12", label: "Stop starting, start finishing" },
      { time: "23:31", label: "Five stories for your next interview" },
    ],
  },
  {
    slug: "why-smart-leaders-stop-making-clear-choices",
    series: "Guest conversation",
    number: "S4 E28",
    title: "Why smart leaders stop making clear choices",
    shortTitle: "Lead through competing demands",
    guest: "Wendy K. Smith",
    date: "14 May 2026",
    publishedAt: "2026-05-14T06:00:00.000Z",
    duration: "62 min",
    summary:
      "Wendy K. Smith brings both-and thinking out of the business-school case study and into the decisions leaders are making today.",
    audioUrl:
      "https://sphinx.acast.com/p/open/s/69d60ca52a193257adc683b0/e/6a02f648b44336455645b435/media.mp3",
    acastUrl:
      "https://shows.acast.com/betteratworkpodcast/episodes/why-smart-leaders-stop-making-clear-choices-wendy-smith",
    accent: "violet",
    topics: ["Leadership", "Complexity", "Decisions"],
    problems: [
      "I am stuck between two good options",
      "My leadership team is polarised",
      "We need to perform and change",
      "I need to make a hard choice",
    ],
    takeaways: [
      "The strongest answer can hold two competing truths at once.",
      "Changing the question changes which solutions become visible.",
      "Both-and leadership needs boundaries, not endless compromise.",
    ],
    moments: [
      { time: "05:24", label: "Why either-or thinking feels safer" },
      { time: "21:06", label: "The four practices of both-and thinking" },
      { time: "44:15", label: "Boundaries make integration possible" },
    ],
  },
  {
    slug: "burnout-is-not-a-yoga-problem",
    series: "Guest conversation",
    number: "S4 E26",
    title: "We can't yoga our way out of bad culture",
    shortTitle: "Burnout is not an individual failure",
    guest: "Jennifer Moss",
    date: "30 April 2026",
    publishedAt: "2026-04-30T06:00:00.000Z",
    duration: "54 min",
    summary:
      "Jennifer Moss separates recovery habits from the organisational causes of burnout and explains what leaders can change.",
    audioUrl:
      "https://sphinx.acast.com/p/open/s/69d60ca52a193257adc683b0/e/69f09c4c526757e10b398fe5/media.mp3",
    acastUrl:
      "https://shows.acast.com/betteratworkpodcast/episodes/we-cant-yoga-our-way-out-of-bad-culture-the-newest-burnout-r",
    accent: "coral",
    topics: ["Burnout", "Culture", "Leadership"],
    problems: [
      "I am burning out",
      "Our culture is exhausting people",
      "Wellbeing initiatives are not working",
      "My team has lost hope",
    ],
    takeaways: [
      "Recovery practices cannot compensate for a workplace that keeps causing harm.",
      "Hope depends on both agency and a believable path forward.",
      "A compliant team may be a team that has stopped believing change is possible.",
    ],
    moments: [
      { time: "06:28", label: "Why burnout is not a resilience problem" },
      { time: "20:14", label: "What hope needs from leaders" },
      { time: "39:42", label: "The quiet cost of compliance" },
    ],
  },
];

const topicDefinitions = [
  {
    slug: "leadership",
    label: "Leadership",
    prompt: "How do I lead clearly without pretending the work is simple?",
    accent: "violet" as Accent,
    description:
      "Conversations about judgement, management, strategy and leading when there is no tidy answer.",
    keywords: [
      "leader",
      "leadership",
      "management",
      "manager",
      "boss",
      "ceo",
      "strategy",
      "decision",
    ],
  },
  {
    slug: "career-change",
    label: "Career change",
    prompt: "What do I do when the old version of success stops fitting?",
    accent: "coral" as Accent,
    description:
      "Useful ideas for changing direction, finding meaning and making the next career move with more evidence.",
    keywords: [
      "career",
      "job",
      "interview",
      "promotion",
      "purpose",
      "talent",
      "success",
      "work you love",
    ],
  },
  {
    slug: "teams-and-culture",
    label: "Teams & culture",
    prompt: "How do we make the way we work feel more human?",
    accent: "green" as Accent,
    description:
      "Research and practical conversations about teams, trust, conflict, workplaces and the cultures people experience.",
    keywords: [
      "team",
      "culture",
      "workplace",
      "office",
      "trust",
      "conflict",
      "collaboration",
      "belonging",
      "relationship",
    ],
  },
  {
    slug: "energy-and-burnout",
    label: "Energy & burnout",
    prompt: "What can change when rest is not fixing the problem?",
    accent: "yellow" as Accent,
    description:
      "Conversations about burnout, stress, sustainable performance and the conditions that help people recover.",
    keywords: [
      "burnout",
      "wellbeing",
      "energy",
      "stress",
      "rest",
      "resilience",
      "exhaust",
      "mental health",
      "health",
    ],
  },
] satisfies Array<{
  slug: TopicSlug;
  label: string;
  prompt: string;
  accent: Accent;
  description: string;
  keywords: string[];
}>;

const accents: Accent[] = ["violet", "coral", "green", "blue", "yellow"];

const formatDate = (publishedAt: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(publishedAt));

const formatDuration = (seconds: number) => {
  if (!seconds) return "Listen on Acast";
  const minutes = Math.ceil(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder ? `${hours} hr ${remainder} min` : `${hours} hr`;
};

const firstParagraph = (summary: string) => {
  const paragraph =
    summary.split(/\n\s*\n/)[0]?.replace(/\s+/g, " ").trim() ||
    "Listen to the full conversation on Acast.";
  if (paragraph.length <= 360) return paragraph;
  const shortened = paragraph.slice(0, 357);
  return `${shortened.slice(0, shortened.lastIndexOf(" "))}…`;
};

const inferSeries = (title: string) => {
  const betterMoment = title.match(/better moments?\s*#\s*(\d+)/i);
  if (betterMoment) return { series: "Better Moments", number: `BM ${betterMoment[1]}` };

  const seasonEpisode = title.match(/\bS(?:eason)?\s*(\d+)\s*(?:E|Ep|Episode)\s*(\d+)/i);
  if (seasonEpisode) {
    return { series: "Podcast archive", number: `S${seasonEpisode[1]} E${seasonEpisode[2]}` };
  }

  if (/listener questions/i.test(title)) {
    return { series: "Listener questions", number: "Q&A" };
  }

  return { series: "Podcast archive", number: "B@W" };
};

const inferGuest = (title: string) => {
  const parts = title.split("|").map((part) => part.trim()).filter(Boolean);
  if (/better moments?/i.test(title) && parts.length > 1) return parts.at(-1) ?? "Better at Work";

  const withGuest = title.match(/\bwith\s+([^|]+)$/i);
  if (withGuest) return withGuest[1].trim();

  return /listener questions/i.test(title)
    ? "Cathal Quinlan & Annette Sloan"
    : "Better at Work";
};

const topicSlugsFor = (title: string, summary: string, editorialTopics: string[] = []) => {
  const haystack = `${title} ${summary} ${editorialTopics.join(" ")}`.toLowerCase();
  const explicit = editorialTopics.map((topic) => topic.toLowerCase());

  return topicDefinitions
    .filter((topic) => {
      if (topic.slug === "leadership" && explicit.includes("leadership")) return true;
      if (topic.slug === "career-change" && explicit.includes("careers")) return true;
      if (
        topic.slug === "teams-and-culture" &&
        explicit.some((item) => ["teams", "culture", "workplace", "relationships"].includes(item))
      ) {
        return true;
      }
      if (
        topic.slug === "energy-and-burnout" &&
        explicit.some((item) => ["burnout", "wellbeing", "energy"].includes(item))
      ) {
        return true;
      }
      return topic.keywords.some((keyword) => haystack.includes(keyword));
    })
    .map((topic) => topic.slug);
};

const utilitiesByAudioUrl: Record<
  string,
  Pick<Episode, "transcript" | "resource">
> = {
  "https://sphinx.acast.com/p/open/s/69d60ca52a193257adc683b0/e/4a9e8aec-f93c-4c86-be25-c3776eef4b66/media.mp3": {
    transcript: {
      href: "/transcripts/helen-tupper-s4e01.txt",
      label: "Download the edited Helen Tupper transcript",
    },
  },
  "https://sphinx.acast.com/p/open/s/69d60ca52a193257adc683b0/e/6a32d1ae5926b9ca34a98bc6/media.mp3": {
    resource: {
      href: "/resources/roger-martin-sum-up.pdf",
      label: "Download the Roger Martin Sum Up",
    },
  },
  "https://sphinx.acast.com/p/open/s/69d60ca52a193257adc683b0/e/6a3c32795bb8a79968e3541a/media.mp3": {
    resource: {
      href: "/resources/roger-martin-sum-up.pdf",
      label: "Download the Roger Martin Sum Up",
    },
  },
};

const curatedByAudioUrl = new Map(
  curatedEpisodes.map((episode) => [episode.audioUrl, episode]),
);

const archiveEpisodes = acastArchive.episodes.map((sourceEpisode, index): Episode => {
  const curated = curatedByAudioUrl.get(sourceEpisode.audioUrl);
  const sourceSummary = sourceEpisode.summary.trim();
  const inferred = inferSeries(sourceEpisode.title);
  const topicSlugs = topicSlugsFor(
    sourceEpisode.title,
    sourceSummary,
    curated?.topics,
  );
  const topicLabels = topicDefinitions
    .filter((topic) => topicSlugs.includes(topic.slug))
    .map((topic) => topic.label);
  const utilities = utilitiesByAudioUrl[sourceEpisode.audioUrl] ?? {};

  const base: Episode = {
    id: sourceEpisode.id,
    slug: sourceEpisode.slug,
    series: inferred.series,
    number: inferred.number,
    title: sourceEpisode.title,
    shortTitle: sourceEpisode.title.split("|")[0].trim(),
    guest: inferGuest(sourceEpisode.title),
    date: formatDate(sourceEpisode.publishedAt),
    publishedAt: sourceEpisode.publishedAt,
    duration: formatDuration(sourceEpisode.durationSeconds),
    durationSeconds: sourceEpisode.durationSeconds,
    summary: firstParagraph(sourceSummary),
    excerpt: firstParagraph(sourceSummary),
    showNotes: sourceSummary,
    audioUrl: sourceEpisode.audioUrl,
    acastUrl: sourceEpisode.acastUrl,
    imageUrl: sourceEpisode.imageUrl || undefined,
    accent: accents[index % accents.length],
    topics: topicLabels.length ? topicLabels : ["Working life"],
    topicSlugs,
    problems: [],
    takeaways: [],
    moments: [],
    curated: false,
    ...utilities,
  };

  if (!curated) return base;

  return {
    ...base,
    ...curated,
    id: sourceEpisode.id,
    publishedAt: sourceEpisode.publishedAt,
    durationSeconds: sourceEpisode.durationSeconds,
    imageUrl: sourceEpisode.imageUrl || undefined,
    topicSlugs,
    excerpt: curated.summary,
    showNotes: sourceSummary,
    curated: true,
    ...utilities,
  };
});

const archivedAudioUrls = new Set(archiveEpisodes.map((episode) => episode.audioUrl));
const missingCuratedEpisodes = curatedEpisodes
  .filter((episode) => !archivedAudioUrls.has(episode.audioUrl))
  .map(
    (episode, index): Episode => ({
      ...episode,
      id: episode.slug,
      durationSeconds: Number.parseInt(episode.duration, 10) * 60,
      excerpt: episode.summary,
      showNotes: episode.summary,
      accent: episode.accent ?? accents[index % accents.length],
      topicSlugs: topicSlugsFor(episode.title, episode.summary, episode.topics),
      curated: true,
      ...(utilitiesByAudioUrl[episode.audioUrl] ?? {}),
    }),
  );

export const episodes: Episode[] = [...archiveEpisodes, ...missingCuratedEpisodes].sort(
  (left, right) => right.publishedAt.localeCompare(left.publishedAt),
);

export const topics = topicDefinitions.map((topic) => ({
  slug: topic.slug,
  label: topic.label,
  prompt: topic.prompt,
  accent: topic.accent,
  description: topic.description,
  count: episodes.filter((episode) => episode.topicSlugs.includes(topic.slug)).length,
}));

export const getEpisode = (slug: string) =>
  episodes.find((episode) => episode.slug === slug);

export const getTopic = (slug: string) =>
  topics.find((topic) => topic.slug === slug);

export const getTopicEpisodes = (slug: TopicSlug) =>
  episodes.filter((episode) => episode.topicSlugs.includes(slug));

export const leadershipEpisodes = getTopicEpisodes("leadership");

export const durationToIso = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `PT${hours ? `${hours}H` : ""}${minutes ? `${minutes}M` : ""}${remainingSeconds ? `${remainingSeconds}S` : ""}`;
};
