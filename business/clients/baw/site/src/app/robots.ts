import type { MetadataRoute } from "next";
import { absoluteUrl, isIndexable } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: isIndexable
      ? { userAgent: "*", allow: "/", disallow: ["/api/", "/better-careers/success"] }
      : { userAgent: "*", disallow: "/" },
    ...(isIndexable ? { sitemap: absoluteUrl("/sitemap.xml") } : {}),
  };
}
