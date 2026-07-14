import type { MetadataRoute } from "next";
import { episodes } from "@/lib/content";

const baseUrl = "https://better-at-work-frontier.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/episodes", "/topics/leadership", "/better-careers", "/about"];
  const staticPages = pages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date("2026-07-14"),
    changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
    priority: path === "" ? 1 : 0.8,
  }));
  const episodePages = episodes.map((episode) => ({
    url: `${baseUrl}/episodes/${episode.slug}`,
    lastModified: new Date(episode.date),
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...episodePages];
}
