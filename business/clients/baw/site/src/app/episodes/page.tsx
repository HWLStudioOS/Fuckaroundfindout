import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { EpisodeArchive } from "@/components/EpisodeArchive";
import { ProblemFinder } from "@/components/ProblemFinder";
import { episodes, topics } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Episodes",
  description:
    "Browse Better@Work conversations about leadership, careers, teams, strategy and sustainable performance.",
  alternates: { canonical: absoluteUrl("/episodes") },
  openGraph: {
    title: "Better at Work episode archive",
    description: "Browse every conversation in the public Better at Work Acast archive.",
    url: absoluteUrl("/episodes"),
  },
};

export default function EpisodesPage() {
  return (
    <>
      <section className="page-hero page-hero--episodes">
        <div className="shell page-hero__grid">
          <div>
            <span className="note-label">{episodes.length} conversations and counting</span>
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
              <span className="eyebrow">Canonical Acast archive</span>
              <h2>Every public conversation</h2>
            </div>
            <p>Choose a topic or browse newest to oldest.</p>
          </div>
          <EpisodeArchive episodes={episodes} topics={topics} />
        </div>
      </section>
    </>
  );
}
