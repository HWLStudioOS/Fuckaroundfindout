import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight, Check, Mic2 } from "lucide-react";
import Link from "next/link";
import { EpisodeCard } from "@/components/EpisodeCard";
import { leadershipEpisodes } from "@/lib/content";

export const metadata: Metadata = {
  title: "Better Leadership",
  description:
    "Better@Work conversations and practical ideas for leading through complexity, change and pressure.",
};

export default function LeadershipPage() {
  return (
    <>
      <section className="topic-hero">
        <div className="shell topic-hero__grid">
          <div>
            <span className="note-label">Better Leadership · Season 5</span>
            <h1>Leadership gets real when the answer is not obvious.</h1>
            <p>
              A new five-part series about the decisions experienced leaders are learning
              the hard way, and the tools that still work when the stakes are real.
            </p>
            <div className="hero__actions">
              <Link className="button button--yellow" href="#series">
                Preview the series <ArrowRight aria-hidden="true" />
              </Link>
              <Link className="button button--ghost" href="#interest">
                Bring us a leadership question
              </Link>
            </div>
          </div>
          <div className="topic-hero__manifesto">
            <Mic2 aria-hidden="true" />
            <span>Five leaders</span>
            <strong>Five tools they actually use</strong>
            <p>No hero stories. No ten-point framework theatre.</p>
          </div>
        </div>
      </section>
      <section className="leadership-principles">
        <div className="shell leadership-principles__grid">
          <span className="eyebrow">The editorial promise</span>
          <div>
            <h2>Useful enough for Monday. Honest enough for the hard bit.</h2>
            <div className="principle-list">
              <article>
                <span>01</span>
                <h3>A real decision</h3>
                <p>The moment where a leader had to choose without complete certainty.</p>
              </article>
              <article>
                <span>02</span>
                <h3>A working tool</h3>
                <p>The question, practice or structure they still rely on.</p>
              </article>
              <article>
                <span>03</span>
                <h3>The cost</h3>
                <p>What changed for the people around them, not only the result.</p>
              </article>
            </div>
          </div>
        </div>
      </section>
      <section className="archive-section" id="series">
        <div className="shell">
          <div className="section-heading section-heading--split">
            <div>
              <span className="eyebrow">Start here</span>
              <h2>Leadership conversations already in the archive.</h2>
            </div>
            <p>Season 5 starts with an existing body of useful work, not an empty promise.</p>
          </div>
          <div className="episode-grid">
            {leadershipEpisodes.slice(0, 4).map((episode) => (
              <EpisodeCard episode={episode} key={episode.slug} />
            ))}
          </div>
        </div>
      </section>
      <section className="leadership-interest" id="interest">
        <div className="shell leadership-interest__grid">
          <div>
            <span className="note-label">A question for the series</span>
            <h2>What is your organisation learning the hard way?</h2>
            <p>
              We are looking for real questions, experienced leaders and organisations
              willing to speak plainly about the work.
            </p>
          </div>
          <form>
            <label>
              <span>Your work email</span>
              <input type="email" placeholder="you@organisation.com" />
            </label>
            <label>
              <span>The question</span>
              <textarea placeholder="The leadership tension we cannot resolve is..." rows={4} />
            </label>
            <button className="button button--ink" type="button">
              Start a conversation <ArrowUpRight aria-hidden="true" />
            </button>
            <small>
              <Check aria-hidden="true" /> Prototype only. Nothing is submitted.
            </small>
          </form>
        </div>
      </section>
    </>
  );
}
