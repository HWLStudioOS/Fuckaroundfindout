import type { MetadataRoute } from "next";
import { episodes, topics } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/episodes", "/better-careers", "/about"];
  const staticPages = pages.map((path) => ({
    url: absoluteUrl(path || "/"),
    lastModified: new Date("2026-08-03"),
    changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
    priority: path === "" ? 1 : 0.8,
  }));
  const episodePages = episodes.map((episode) => ({
    url: absoluteUrl(`/episodes/${episode.slug}`),
    lastModified: new Date(episode.publishedAt),
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  const topicPages = topics.map((topic) => ({
    url: absoluteUrl(`/topics/${topic.slug}`),
    lastModified: new Date("2026-08-03"),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...topicPages, ...episodePages];
}
