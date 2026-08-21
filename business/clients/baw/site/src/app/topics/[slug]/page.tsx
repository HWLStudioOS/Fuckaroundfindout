import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EpisodeCard } from "@/components/EpisodeCard";
import { getTopic, getTopicEpisodes, topics, type TopicSlug } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return topics
    .filter((topic) => topic.slug !== "leadership")
    .map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) return {};

  const url = absoluteUrl(`/topics/${topic.slug}`);
  return {
    title: topic.label,
    description: topic.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${topic.label} conversations | Better at Work`,
      description: topic.description,
      url,
    },
  };
}

export default async function TopicPage({ params }: PageProps) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic || topic.slug === "leadership") notFound();
  const topicEpisodes = getTopicEpisodes(topic.slug as TopicSlug);

  return (
    <>
      <section className="page-hero topic-archive-hero" data-accent={topic.accent}>
        <div className="shell page-hero__grid">
          <div>
            <span className="note-label">{topicEpisodes.length} conversations</span>
            <h1>{topic.label}</h1>
          </div>
          <div>
            <p>{topic.description}</p>
            <Link className="text-link" href="/episodes">
              <ArrowLeft aria-hidden="true" /> Full archive
            </Link>
          </div>
        </div>
      </section>
      <section className="archive-section">
        <div className="shell">
          <div className="section-heading section-heading--split">
            <div>
              <span className="eyebrow">Start with the tension</span>
              <h2>{topic.prompt}</h2>
            </div>
            <p>Newest first, sourced from the public Better at Work Acast feed.</p>
          </div>
          <div className="episode-grid episode-grid--archive">
            {topicEpisodes.map((episode) => (
              <EpisodeCard episode={episode} key={episode.slug} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
