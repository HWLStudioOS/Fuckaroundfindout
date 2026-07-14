"use client";

import { ArrowRight, Check, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { type FormEvent, useMemo, useState } from "react";
import { episodes, type Episode } from "@/lib/content";
import { PlayButton } from "./AudioPlayer";

const prompts = [
  "I have too many priorities",
  "My boss is micromanaging me",
  "I am thinking about changing career",
  "Our team is burning out",
];

const groups: Record<string, string[]> = {
  leadership: ["boss", "manager", "leader", "micromanaging", "control", "direction"],
  burnout: ["burnout", "burning", "tired", "exhausted", "energy", "overwork", "stress"],
  career: ["career", "job", "interview", "stuck", "change", "promotion", "purpose"],
  priorities: ["priority", "priorities", "busy", "everything", "finish", "focus"],
  strategy: ["strategy", "plan", "choice", "decision", "ai", "average"],
  culture: ["culture", "team", "office", "workplace", "hot desk", "connection"],
  conflict: ["conflict", "difficult", "conversation", "disagree", "tension", "polarised"],
};

const normalise = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2);

const expandedTerms = (query: string) => {
  const base = new Set(normalise(query));
  Object.entries(groups).forEach(([label, words]) => {
    if (words.some((word) => query.toLowerCase().includes(word))) {
      base.add(label);
      words.forEach((word) => normalise(word).forEach((term) => base.add(term)));
    }
  });
  return [...base];
};

const scoreEpisode = (episode: Episode, query: string) => {
  const terms = expandedTerms(query);
  const problemText = episode.problems.join(" ").toLowerCase();
  const titleText = `${episode.title} ${episode.shortTitle}`.toLowerCase();
  const bodyText = [
    episode.summary,
    ...episode.topics,
    ...episode.takeaways,
    ...episode.problems,
  ]
    .join(" ")
    .toLowerCase();

  return terms.reduce((score, term) => {
    if (problemText.includes(term)) score += 5;
    if (titleText.includes(term)) score += 4;
    if (bodyText.includes(term)) score += 2;
    return score;
  }, 0);
};

export function ProblemFinder({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [sent, setSent] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return episodes
      .map((episode) => ({ episode, score: scoreEpisode(episode, query) }))
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [query]);

  const search = (event?: FormEvent) => {
    event?.preventDefault();
    if (query.trim()) setSearched(true);
  };

  return (
    <div className={`problem-finder${compact ? " problem-finder--compact" : ""}`}>
      <div className="problem-finder__intro">
        <span className="note-label">
          <Sparkles aria-hidden="true" /> Work Problem Finder
        </span>
        <h2>What are you working through?</h2>
        <p>
          Describe the problem in your own words. We will find useful ideas from real
          Better@Work conversations, with every source attached.
        </p>
      </div>
      <form className="finder-search" onSubmit={search}>
        <Search aria-hidden="true" />
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setSearched(false);
          }}
          placeholder="My team has too many priorities and nothing gets finished..."
          aria-label="Describe a work problem"
        />
        <button type="submit">
          Find an answer <ArrowRight aria-hidden="true" />
        </button>
      </form>
      <div className="finder-prompts" aria-label="Example searches">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => {
              setQuery(prompt);
              setSearched(true);
            }}
          >
            {prompt}
          </button>
        ))}
      </div>
      {searched ? (
        <div className="finder-results" aria-live="polite">
          <div className="finder-results__head">
            <div>
              <span className="eyebrow">Grounded in the archive</span>
              <h3>
                {results.length ? `${results.length} useful places to start` : "Try another angle"}
              </h3>
            </div>
            {results.length ? (
              <button className="text-button" type="button" onClick={() => setEmailOpen(true)}>
                Email this playlist <ArrowRight aria-hidden="true" />
              </button>
            ) : null}
          </div>
          {results.length ? (
            <div className="finder-result-list">
              {results.map(({ episode }, index) => (
                <article className="finder-result" key={episode.slug}>
                  <span className="finder-result__rank">0{index + 1}</span>
                  <div>
                    <span className="eyebrow">
                      {episode.series} · {episode.duration}
                    </span>
                    <h4>
                      <Link href={`/episodes/${episode.slug}`}>{episode.shortTitle}</Link>
                    </h4>
                    <p>{episode.takeaways[0]}</p>
                    <div className="finder-result__source">
                      <Check aria-hidden="true" /> Source attached · {episode.guest}
                    </div>
                  </div>
                  <PlayButton episode={episode} compact />
                </article>
              ))}
            </div>
          ) : (
            <p>
              Try naming the tension, person or outcome. For example, “I am exhausted but
              the work cannot stop” or “our strategy has too many priorities”.
            </p>
          )}
        </div>
      ) : null}
      {emailOpen ? (
        <form
          className="finder-email"
          onSubmit={(event) => {
            event.preventDefault();
            setSent(true);
          }}
        >
          {sent ? (
            <p>
              <Check aria-hidden="true" /> Playlist ready. In production, this hands off to
              Kit with your chosen topic only.
            </p>
          ) : (
            <>
              <label htmlFor="finder-email">Send this listening list to</label>
              <div>
                <input id="finder-email" type="email" placeholder="you@example.com" required />
                <button className="button button--ink" type="submit">
                  Send playlist
                </button>
              </div>
              <small>Prototype only. No address is stored or sent.</small>
            </>
          )}
        </form>
      ) : null}
    </div>
  );
}
