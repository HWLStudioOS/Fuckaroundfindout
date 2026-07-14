import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight, BookOpen, Check, Clock3, Quote } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PlayButton } from "@/components/AudioPlayer";
import { EpisodeCard } from "@/components/EpisodeCard";
import { episodes, getEpisode } from "@/lib/content";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return episodes.map((episode) => ({ slug: episode.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const episode = getEpisode(slug);
  if (!episode) return {};
  return {
    title: episode.title,
    description: episode.summary,
  };
}

export default async function EpisodePage({ params }: PageProps) {
  const { slug } = await params;
  const episode = getEpisode(slug);
  if (!episode) notFound();
  const related = episodes
    .filter(
      (candidate) =>
        candidate.slug !== episode.slug &&
        candidate.topics.some((topic) => episode.topics.includes(topic)),
    )
    .slice(0, 3);
  const episodeSchema = {
    "@context": "https://schema.org",
    "@type": "PodcastEpisode",
    name: episode.title,
    description: episode.summary,
    url: `https://better-at-work-frontier.vercel.app/episodes/${episode.slug}`,
    datePublished: new Date(episode.date).toISOString(),
    timeRequired: episode.duration,
    partOfSeries: {
      "@type": "PodcastSeries",
      name: "Better@Work",
      url: "https://better-at-work-frontier.vercel.app",
    },
    associatedMedia: {
      "@type": "MediaObject",
      contentUrl: episode.audioUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(episodeSchema).replace(/</g, "\\u003c"),
        }}
      />
      <article className="episode-page" data-accent={episode.accent}>
        <header className="episode-hero">
          <div className="shell episode-hero__grid">
            <div className="episode-hero__meta">
              <span className="note-label">{episode.series}</span>
              <span>{episode.number}</span>
              <span>{episode.date}</span>
            </div>
            <div className="episode-hero__copy">
              <div className="episode-hero__topics">
                {episode.topics.map((topic) => (
                  <span key={topic}>{topic}</span>
                ))}
              </div>
              <h1>{episode.title}</h1>
              <p>{episode.summary}</p>
              <div className="episode-hero__byline">
                <strong>{episode.guest}</strong>
                <span>
                  <Clock3 aria-hidden="true" /> {episode.duration}
                </span>
              </div>
              <div className="episode-hero__actions">
                <PlayButton episode={episode} />
                <a className="button button--ghost" href={episode.acastUrl}>
                  Open in Acast <ArrowUpRight aria-hidden="true" />
                </a>
              </div>
            </div>
            <div className="episode-hero__art" aria-hidden="true">
              <span>{episode.number}</span>
              <strong>{episode.shortTitle}</strong>
              <div>Useful now</div>
            </div>
          </div>
        </header>

        <div className="shell episode-body">
          <aside className="episode-index">
            <span className="eyebrow">In this conversation</span>
            {episode.moments.map((moment) => (
              <button key={moment.time} type="button">
                <span>{moment.time}</span>
                {moment.label}
              </button>
            ))}
          </aside>
          <div className="episode-body__main">
            <section className="takeaway-section">
              <span className="note-label">Three ideas worth keeping</span>
              <div className="takeaway-list">
                {episode.takeaways.map((takeaway, index) => (
                  <article key={takeaway}>
                    <span>0{index + 1}</span>
                    <p>{takeaway}</p>
                  </article>
                ))}
              </div>
            </section>

            {episode.quote ? (
              <blockquote className="episode-quote">
                <Quote aria-hidden="true" />
                <p>{episode.quote}</p>
                <cite>{episode.guest}</cite>
              </blockquote>
            ) : null}

            <section className="transcript-section">
              <div className="section-heading section-heading--split">
                <div>
                  <span className="eyebrow">Editorial outline</span>
                  <h2>Follow the useful thread.</h2>
                </div>
                <button className="text-button" type="button">
                  Full transcript at launch <ArrowRight aria-hidden="true" />
                </button>
              </div>
              <div className="transcript-lines">
                <article>
                  <span>Opening question</span>
                  <p>
                    Cathal establishes the tension behind the episode and asks where the
                    accepted workplace answer stops being useful.
                  </p>
                </article>
                <article>
                  <span>Guest idea · {episode.moments[1]?.time ?? "08:12"}</span>
                  <p>{episode.takeaways[0]}</p>
                </article>
                <article>
                  <span>Take it offline</span>
                  <p>
                    Cathal and Annette test the idea against real working life and turn it
                    into a question a listener can use next.
                  </p>
                </article>
              </div>
            </section>

            <section className="resource-callout">
              <div className="resource-callout__cover">
                <span>SUM UP</span>
                <strong>{episode.shortTitle}</strong>
                <small>Think · Read · Act</small>
              </div>
              <div>
                <span className="eyebrow">Take it into the week</span>
                <h2>The one-page Sum Up.</h2>
                <p>
                  The three ideas, the useful source material and one thing to try. Save it
                  now, use it when the work gets noisy.
                </p>
                <button className="button button--ink" type="button">
                  Get the Sum Up <ArrowRight aria-hidden="true" />
                </button>
              </div>
            </section>

            <section className="sources-section">
              <span className="eyebrow">Sources and further reading</span>
              <a href={episode.acastUrl}>
                <BookOpen aria-hidden="true" /> Full episode and show notes on Acast
                <ArrowUpRight aria-hidden="true" />
              </a>
              <div>
                <Check aria-hidden="true" /> Every quoted idea links back to its source in
                the production version.
              </div>
            </section>
          </div>
        </div>
      </article>
      <section className="related-section">
        <div className="shell">
          <div className="section-heading">
            <span className="eyebrow">Keep going</span>
            <h2>Related conversations</h2>
          </div>
          <div className="episode-grid">
            {related.map((item) => (
              <EpisodeCard episode={item} key={item.slug} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
