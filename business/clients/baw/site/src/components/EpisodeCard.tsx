import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { Episode } from "@/lib/content";
import { PlayButton } from "./AudioPlayer";

export function EpisodeCard({
  episode,
  featured = false,
}: {
  episode: Episode;
  featured?: boolean;
}) {
  return (
    <article
      className={`episode-card${featured ? " episode-card--featured" : ""}`}
      data-accent={episode.accent}
    >
      <div className="episode-card__topline">
        <span>{episode.series}</span>
        <time dateTime={episode.publishedAt}>{episode.date}</time>
      </div>
      <div className="episode-card__number">{episode.number}</div>
      <h3>
        <Link href={`/episodes/${episode.slug}`}>{episode.shortTitle}</Link>
      </h3>
      <p>{episode.excerpt}</p>
      <div className="episode-card__footer">
        <PlayButton episode={episode} compact />
        <span>{episode.guest}</span>
        <Link
          className="round-link"
          href={`/episodes/${episode.slug}`}
          aria-label={`Read episode notes for ${episode.title}`}
        >
          <ArrowUpRight aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
