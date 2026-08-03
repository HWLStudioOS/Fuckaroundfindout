import type { Metadata } from "next";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  Clock3,
  Download,
  FileText,
  Quote,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EpisodeMomentButton, PlayButton } from "@/components/AudioPlayer";
import { EpisodeCard } from "@/components/EpisodeCard";
import {
  ACAST_FEED_URL,
  durationToIso,
  episodes,
  getEpisode,
} from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return episodes.map((episode) => ({ slug: episode.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const episode = getEpisode(slug);
  if (!episode) return {};
  const url = absoluteUrl(`/episodes/${episode.slug}`);

  return {
    title: episode.title,
    description: episode.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: episode.title,
      description: episode.excerpt,
      url,
      publishedTime: episode.publishedAt,
    },
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
        candidate.topicSlugs.some((topic) => episode.topicSlugs.includes(topic)),
    )
    .slice(0, 3);
  const episodeUrl = absoluteUrl(`/episodes/${episode.slug}`);
  const episodeSchema = {
    "@context": "https://schema.org",
    "@type": "PodcastEpisode",
    name: episode.title,
    description: episode.excerpt,
    url: episodeUrl,
    sameAs: episode.acastUrl,
    datePublished: episode.publishedAt,
    ...(episode.durationSeconds
      ? { timeRequired: durationToIso(episode.durationSeconds) }
      : {}),
    partOfSeries: {
      "@type": "PodcastSeries",
      name: "Better at Work",
      url: absoluteUrl("/"),
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
              <time dateTime={episode.publishedAt}>{episode.date}</time>
            </div>
            <div className="episode-hero__copy">
              <div className="episode-hero__topics">
                {episode.topics.map((topic) => (
                  <span key={topic}>{topic}</span>
                ))}
              </div>
              <h1>{episode.title}</h1>
              <p>{episode.excerpt}</p>
              <div className="episode-hero__byline">
                <strong>{episode.guest}</strong>
                <span>
                  <Clock3 aria-hidden="true" /> {episode.duration}
                </span>
              </div>
              <div className="episode-hero__actions">
                <PlayButton episode={episode} />
                <a
                  className="button button--ghost"
                  href={episode.acastUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open episode source <ArrowUpRight aria-hidden="true" />
                </a>
              </div>
            </div>
            <div className="episode-hero__art" aria-hidden="true">
              <span>{episode.number}</span>
              <strong>{episode.shortTitle}</strong>
              <div>{episode.curated ? "Editorial notes" : "From the archive"}</div>
            </div>
          </div>
        </header>

        <div className="shell episode-body">
          <aside className="episode-index" aria-label="Episode navigation">
            {episode.moments.length ? (
              <>
                <span className="eyebrow">In this conversation</span>
                {episode.moments.map((moment) => (
                  <EpisodeMomentButton
                    episode={episode}
                    time={moment.time}
                    label={moment.label}
                    key={moment.time}
                  />
                ))}
              </>
            ) : (
              <div className="episode-record">
                <span className="eyebrow">Episode record</span>
                <dl>
                  <div>
                    <dt>Published</dt>
                    <dd>{episode.date}</dd>
                  </div>
                  <div>
                    <dt>Length</dt>
                    <dd>{episode.duration}</dd>
                  </div>
                  <div>
                    <dt>Source</dt>
                    <dd>Acast RSS</dd>
                  </div>
                </dl>
              </div>
            )}
          </aside>
          <div className="episode-body__main">
            {episode.takeaways.length ? (
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
            ) : (
              <section className="show-notes-section">
                <span className="note-label">Canonical show notes</span>
                <h2>About this episode.</h2>
                <div className="show-notes-copy">
                  {episode.showNotes.split(/\n\s*\n/).map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            )}

            {episode.quote ? (
              <blockquote className="episode-quote">
                <Quote aria-hidden="true" />
                <p>{episode.quote}</p>
                <cite>{episode.guest}</cite>
              </blockquote>
            ) : null}

            {episode.curated ? (
              <section className="transcript-section">
                <div className="section-heading">
                  <span className="eyebrow">Editorial outline</span>
                  <h2>Follow the useful thread.</h2>
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
                    <span>Guest idea · {episode.moments[1]?.time ?? "Listen in"}</span>
                    <p>{episode.takeaways[0] ?? episode.excerpt}</p>
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
            ) : null}

            <section className="episode-utility" aria-labelledby="transcript-heading">
              <div>
                <span className="eyebrow">Transcript</span>
                <h2 id="transcript-heading">
                  {episode.transcript ? "Read the conversation." : "Listen with the source attached."}
                </h2>
              </div>
              {episode.transcript ? (
                <a className="button button--ink" href={episode.transcript.href} download>
                  <FileText aria-hidden="true" /> {episode.transcript.label}
                </a>
              ) : (
                <div className="utility-status" role="note">
                  <FileText aria-hidden="true" />
                  <p>
                    A transcript has not been attached to this episode. Audio and canonical
                    show notes remain available through the episode source.
                  </p>
                </div>
              )}
            </section>

            {episode.resource ? (
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
                    The useful ideas, source material and one thing to try. This is the
                    finished production resource attached to this conversation.
                  </p>
                  <a className="button button--ink" href={episode.resource.href} download>
                    <Download aria-hidden="true" /> {episode.resource.label}
                  </a>
                </div>
              </section>
            ) : null}

            <section className="sources-section">
              <span className="eyebrow">Sources and further reading</span>
              <a href={episode.acastUrl} target="_blank" rel="noreferrer">
                <BookOpen aria-hidden="true" /> Canonical episode page and show notes
                <ArrowUpRight aria-hidden="true" />
              </a>
              <a href={ACAST_FEED_URL} target="_blank" rel="noreferrer">
                <BookOpen aria-hidden="true" /> Canonical Better at Work RSS feed
                <ArrowUpRight aria-hidden="true" />
              </a>
              <div>
                <Check aria-hidden="true" /> Title, audio, publication date and show notes
                are normalised from the public Acast feed.
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
          <Link className="text-link related-section__archive-link" href="/episodes">
            Browse the full archive <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
