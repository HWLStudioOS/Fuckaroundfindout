import Link from "next/link";
import { isCheckoutConfigured } from "@/lib/checkout";
import { Logo } from "./Logo";

export function Footer() {
  const checkoutLive = isCheckoutConfigured();
  return (
    <footer className="site-footer">
      <div className="shell site-footer__grid">
        <div>
          <Logo />
          <p>Honest conversations. Useful ways to work better.</p>
        </div>
        <div>
          <span className="eyebrow">Explore</span>
          <Link href="/episodes">Episodes</Link>
          <Link href="/topics/leadership">Leadership</Link>
          <Link href="/better-careers">Better Careers</Link>
          <Link href="/about">About</Link>
        </div>
        <div>
          <span className="eyebrow">Listen</span>
          <a href="https://podcasts.apple.com/gb/podcast/better-at-work-with-cathal-quinlan/id1619332673">
            Apple Podcasts
          </a>
          <a href="https://open.spotify.com/show/4YjMdM7YQyxDvudKRkTzkO">Spotify</a>
          <a href="https://shows.acast.com/betteratworkpodcast/episodes">Acast</a>
          <a href="https://www.youtube.com/@betteratworkpod">YouTube</a>
        </div>
      </div>
      <div className="shell site-footer__bottom">
        <span>© 2026 Better@Work</span>
        <span>
          {checkoutLive
            ? "Draft site · Better Bits signup is not yet live"
            : "Draft site · Forms and checkout are not yet live"}
        </span>
      </div>
    </footer>
  );
}
