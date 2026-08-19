import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope, Newsreader } from "next/font/google";
import { AudioProvider } from "@/components/AudioPlayer";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ACAST_FEED_URL } from "@/lib/content";
import {
  absoluteUrl,
  isIndexable,
  siteDescription,
  siteName,
  siteUrl,
} from "@/lib/site";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  style: ["normal", "italic"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Better at Work | Conversations for the work ahead",
    template: "%s | Better at Work",
  },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: "Cathal Quinlan" }, { name: "Annette Sloan" }],
  category: "Business",
  referrer: "origin-when-cross-origin",
  robots: isIndexable
    ? { index: true, follow: true }
    : { index: false, follow: false, noarchive: true, nocache: true },
  openGraph: {
    title: "Better at Work",
    description: siteDescription,
    type: "website",
    locale: "en_GB",
    siteName,
    url: absoluteUrl("/"),
    images: [
      {
        url: absoluteUrl("/opengraph-image"),
        width: 1200,
        height: 630,
        alt: "Better at Work. Conversations for the work ahead.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Better at Work",
    description: siteDescription,
    images: [absoluteUrl("/opengraph-image")],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const podcastSchema = {
    "@context": "https://schema.org",
    "@type": "PodcastSeries",
    name: siteName,
    url: absoluteUrl("/"),
    description: siteDescription,
    author: [
      { "@type": "Person", name: "Cathal Quinlan" },
      { "@type": "Person", name: "Annette Sloan" },
    ],
    webFeed: ACAST_FEED_URL,
  };

  return (
    <html lang="en-GB" data-scroll-behavior="smooth">
      <body className={`${manrope.variable} ${newsreader.variable} ${plexMono.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(podcastSchema).replace(/</g, "\\u003c"),
          }}
        />
        <AudioProvider>
          <a className="skip-link" href="#main-content">
            Skip to content
          </a>
          <Header />
          <main id="main-content" tabIndex={-1}>{children}</main>
          <Footer />
        </AudioProvider>
      </body>
    </html>
  );
}
