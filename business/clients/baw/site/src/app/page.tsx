import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Mic2,
  Quote,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { EpisodeCard } from "@/components/EpisodeCard";
import { NewsletterForm } from "@/components/NewsletterForm";
import { PlayButton } from "@/components/AudioPlayer";
import { ProblemFinder } from "@/components/ProblemFinder";
import { episodes, topics } from "@/lib/content";

const latest = episodes[0];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="shell hero__grid">
          <div className="hero__copy">
            <span className="note-label note-label--tilted">A podcast for real working life</span>
            <h1>
              Honest conversations.
              <span className="hero__highlight">Useful ways</span>
              to work better.
            </h1>
            <p>
              Cathal Quinlan and Annette Sloan find the ideas worth keeping, ask the
              questions work tends to avoid, and turn every conversation into something you
              can actually use.
            </p>
            <div className="hero__actions">
              <PlayButton episode={latest} />
              <Link className="button button--ghost" href="#find">
                Find an answer <ArrowDown aria-hidden="true" />
              </Link>
            </div>
            <div className="hero__proof">
              <span>81 conversations</span>
              <span>New season in September</span>
              <span>AU · UK · US</span>
            </div>
          </div>
          <div className="hero__visual" aria-label="Cathal Quinlan and Annette Sloan">
            <div className="hero__sun" />
            <div className="hero__annotation hero__annotation--one">
              <span>Guest idea</span>
              <strong>What is worth keeping?</strong>
            </div>
            <div className="hero__annotation hero__annotation--two">
              <span>Take it offline</span>
              <strong>What does it change?</strong>
            </div>
            <Image
              src="/assets/cathal-annette.png"
              alt="Cathal Quinlan and Annette Sloan"
              width={400}
              height={600}
              priority
              loading="eager"
            />
            <div className="hero__scribble" aria-hidden="true">
              Real talk → useful action
            </div>
          </div>
        </div>
      </section>

      <section className="latest-section">
        <div className="shell">
          <div className="section-heading section-heading--split">
            <div>
              <span className="eyebrow">Latest episode</span>
              <h2>Four ideas survived the season.</h2>
            </div>
            <Link className="text-link" href="/episodes">
              Browse all episodes <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <article className="latest-stage">
            <div className="latest-stage__art">
              <span className="latest-stage__season">S4</span>
              <span className="latest-stage__word latest-stage__word--one">Better</span>
              <span className="latest-stage__word latest-stage__word--two">ideas</span>
              <span className="latest-stage__word latest-stage__word--three">kept.</span>
              <div className="latest-stage__stamp">Finale · 36 min</div>
            </div>
            <div className="latest-stage__content">
              <span className="note-label">Recorded together in London</span>
              <h3>{latest.title}</h3>
              <p>{latest.summary}</p>
              <ul className="tick-list">
                {latest.takeaways.map((takeaway) => (
                  <li key={takeaway}>
                    <Check aria-hidden="true" /> {takeaway}
                  </li>
                ))}
              </ul>
              <div className="latest-stage__actions">
                <PlayButton episode={latest} />
                <Link className="text-link" href={`/episodes/${latest.slug}`}>
                  Read the notes <ArrowUpRight aria-hidden="true" />
                </Link>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="finder-section" id="find">
        <div className="shell">
          <ProblemFinder />
        </div>
      </section>

      <section className="topics-section">
        <div className="shell">
          <div className="section-heading section-heading--split">
            <div>
              <span className="eyebrow">Start with the problem</span>
              <h2>Work rarely arrives in neat categories.</h2>
            </div>
            <p>
              So the archive is organised around the things people are actually trying to
              solve.
            </p>
          </div>
          <div className="topic-grid">
            {topics.map((topic, index) => (
              <Link
                className="topic-card"
                data-accent={topic.accent}
                href={topic.slug === "leadership" ? "/topics/leadership" : "/#find"}
                key={topic.slug}
              >
                <span className="topic-card__number">0{index + 1}</span>
                <span className="eyebrow">{topic.count} conversations</span>
                <h3>{topic.label}</h3>
                <p>{topic.prompt}</p>
                <span className="round-link">
                  <ArrowUpRight aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="duo-section">
        <div className="shell duo-section__grid">
          <div className="duo-section__portrait">
            <Image
              src="/assets/cathal-annette.png"
              alt="Cathal and Annette smiling"
              width={400}
              height={600}
            />
            <div className="duo-section__quote">
              <Quote aria-hidden="true" />
              <span>The guest gives us the idea. We work out whether it survives Monday.</span>
            </div>
          </div>
          <div className="duo-section__copy">
            <span className="note-label">Let's Take This Offline</span>
            <h2>Two perspectives. One useful question.</h2>
            <p>
              Cathal brings the practitioner’s instinct. Annette brings the coach’s clarity.
              After the interview, they take the big ideas offline, test them against real
              work and answer a listener question.
            </p>
            <div className="voice-pair">
              <div>
                <span>CQ</span>
                <strong>Cathal Quinlan</strong>
                <p>Host, leader and enthusiastic interrogator of workplace nonsense.</p>
              </div>
              <div>
                <span>AS</span>
                <strong>Annette Sloan</strong>
                <p>Coach, collaborator and the person most likely to ask what this means.</p>
              </div>
            </div>
            <Link className="button button--ink" href="/about">
              Meet Cathal & Annette <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="recent-section">
        <div className="shell">
          <div className="section-heading section-heading--split">
            <div>
              <span className="eyebrow">From the archive</span>
              <h2>Three conversations worth your next hour.</h2>
            </div>
          </div>
          <div className="episode-grid">
            {episodes.slice(1, 4).map((episode) => (
              <EpisodeCard episode={episode} key={episode.slug} />
            ))}
          </div>
        </div>
      </section>

      <section className="paths-section">
        <div className="shell">
          <div className="section-heading">
            <span className="eyebrow">Put the idea to work</span>
            <h2>Listening is the beginning.</h2>
          </div>
          <div className="path-grid">
            <article className="path-card path-card--careers">
              <div className="path-card__icon">
                <ArrowUpRight aria-hidden="true" />
              </div>
              <span className="eyebrow">For you</span>
              <h3>Better Careers</h3>
              <p>A practical six-step reset for experienced people deciding what comes next.</p>
              <Link href="/better-careers">
                Explore Better Careers <ArrowRight aria-hidden="true" />
              </Link>
            </article>
            <article className="path-card path-card--leadership">
              <div className="path-card__icon">
                <Mic2 aria-hidden="true" />
              </div>
              <span className="eyebrow">For organisations</span>
              <h3>Better Leadership</h3>
              <p>
                A new Season 5 series about what experienced leaders are learning the hard
                way.
              </p>
              <Link href="/topics/leadership">
                Preview the series <ArrowRight aria-hidden="true" />
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="newsletter-section" id="newsletter">
        <div className="shell newsletter-section__grid">
          <div>
            <span className="note-label">The Better Bits</span>
            <h2>One useful idea for the week ahead.</h2>
          </div>
          <div>
            <p>
              The idea, the bit worth remembering, and one thing to try. Written by Cathal
              and Annette. Sent on Sunday.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
}
