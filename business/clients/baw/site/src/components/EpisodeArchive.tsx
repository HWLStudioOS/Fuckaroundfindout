"use client";

import { SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Episode, TopicSlug } from "@/lib/content";
import { EpisodeCard } from "./EpisodeCard";

type TopicFilter = {
  slug: TopicSlug;
  label: string;
  count: number;
};

export function EpisodeArchive({
  episodes,
  topics,
}: {
  episodes: Episode[];
  topics: TopicFilter[];
}) {
  const [activeTopic, setActiveTopic] = useState<TopicSlug | "all">("all");

  useEffect(() => {
    const requestedTopic = new URLSearchParams(window.location.search).get("topic");
    if (topics.some((topic) => topic.slug === requestedTopic)) {
      setActiveTopic(requestedTopic as TopicSlug);
    }
  }, [topics]);

  const visibleEpisodes = useMemo(
    () =>
      activeTopic === "all"
        ? episodes
        : episodes.filter((episode) => episode.topicSlugs.includes(activeTopic)),
    [activeTopic, episodes],
  );

  const selectTopic = (topic: TopicSlug | "all") => {
    setActiveTopic(topic);
    const url = new URL(window.location.href);
    if (topic === "all") url.searchParams.delete("topic");
    else url.searchParams.set("topic", topic);
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  };

  return (
    <div className="archive-browser">
      <div className="archive-filter" aria-label="Filter episodes by topic">
        <span className="archive-filter__label">
          <SlidersHorizontal aria-hidden="true" /> Topic
        </span>
        <button
          type="button"
          aria-pressed={activeTopic === "all"}
          onClick={() => selectTopic("all")}
        >
          All <span>{episodes.length}</span>
        </button>
        {topics.map((topic) => (
          <button
            type="button"
            aria-pressed={activeTopic === topic.slug}
            onClick={() => selectTopic(topic.slug)}
            key={topic.slug}
          >
            {topic.label} <span>{topic.count}</span>
          </button>
        ))}
      </div>
      <p className="archive-results-summary" role="status" aria-live="polite">
        Showing {visibleEpisodes.length} {visibleEpisodes.length === 1 ? "episode" : "episodes"}
        {activeTopic === "all"
          ? " from the public archive."
          : ` about ${topics.find((topic) => topic.slug === activeTopic)?.label.toLowerCase()}.`}
      </p>
      {visibleEpisodes.length ? (
        <div className="episode-grid episode-grid--archive">
          {visibleEpisodes.map((episode) => (
            <EpisodeCard episode={episode} key={episode.slug} />
          ))}
        </div>
      ) : (
        <div className="archive-empty">
          <h3>No episodes matched this topic.</h3>
          <button type="button" className="text-button" onClick={() => selectTopic("all")}>
            Clear the filter
          </button>
        </div>
      )}
    </div>
  );
}
