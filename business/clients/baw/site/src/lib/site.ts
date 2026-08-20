const ensureProtocol = (value: string) =>
  /^https?:\/\//i.test(value) ? value : `https://${value}`;

const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
const vercelUrl =
  process.env.VERCEL_ENV === "production"
    ? process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
    : process.env.VERCEL_URL;

export const siteUrl = new URL(
  ensureProtocol(configuredUrl || vercelUrl || "http://localhost:3000"),
);

export const isIndexable =
  process.env.VERCEL_ENV === "production" ||
  (process.env.NODE_ENV === "production" && Boolean(configuredUrl));

export const absoluteUrl = (path = "/") => new URL(path, siteUrl).toString();

export const siteName = "Better at Work";
export const siteDescription =
  "Honest conversations and useful ideas for better careers, teams and leadership, with Cathal Quinlan and Annette Sloan.";
