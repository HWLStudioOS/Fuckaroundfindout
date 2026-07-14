import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope, Newsreader } from "next/font/google";
import { AudioProvider } from "@/components/AudioPlayer";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://better-at-work-frontier.vercel.app"),
  title: {
    default: "Better@Work | Useful ideas for working better",
    template: "%s | Better@Work",
  },
  description:
    "Honest conversations and useful ideas for better careers, teams and leadership, with Cathal Quinlan and Annette Sloan.",
  openGraph: {
    title: "Better@Work",
    description: "Honest conversations. Useful ways to work better.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const podcastSchema = {
    "@context": "https://schema.org",
    "@type": "PodcastSeries",
    name: "Better@Work",
    url: "https://better-at-work-frontier.vercel.app",
    description:
      "Honest conversations and useful ideas for better careers, teams and leadership.",
    author: [
      { "@type": "Person", name: "Cathal Quinlan" },
      { "@type": "Person", name: "Annette Sloan" },
    ],
    webFeed: "https://feeds.acast.com/public/shows/69d60ca52a193257adc683b0",
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
          <main id="main-content">{children}</main>
          <Footer />
        </AudioProvider>
      </body>
    </html>
  );
}
