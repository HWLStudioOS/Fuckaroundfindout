import type { Metadata } from "next";
import { ArrowRight, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { EpisodeCard } from "@/components/EpisodeCard";
import { ProblemFinder } from "@/components/ProblemFinder";
import { episodes } from "@/lib/content";

export const metadata: Metadata = {
  title: "Episodes",
  description:
    "Browse Better@Work conversations about leadership, careers, teams, strategy and sustainable performance.",
};

export default function EpisodesPage() {
  return (
    <>
      <section className="page-hero page-hero--episodes">
        <div className="shell page-hero__grid">
          <div>
            <span className="note-label">81 conversations and counting</span>
            <h1>Find the idea you need now.</h1>
          </div>
          <div>
            <p>
              Search by the problem, browse a topic or start with the conversations Cathal
              and Annette still use themselves.
            </p>
            <Link className="text-link" href="#episode-list">
              Browse the latest <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      <section className="archive-finder">
        <div className="shell">
          <ProblemFinder compact />
        </div>
      </section>
      <section className="archive-section" id="episode-list">
        <div className="shell">
          <div className="archive-toolbar">
            <div>
              <span className="eyebrow">Season 4</span>
              <h2>Latest conversations</h2>
            </div>
            <button type="button" aria-label="Filter episodes">
              <SlidersHorizontal aria-hidden="true" /> Filter by topic
            </button>
          </div>
          <div className="episode-grid episode-grid--archive">
            {episodes.map((episode) => (
              <EpisodeCard episode={episode} key={episode.slug} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
