import { ArrowUpRight, Radio } from "lucide-react";

export function NewsletterForm() {
  return (
    <div className="newsletter-placeholder" role="note">
      <Radio aria-hidden="true" />
      <div>
        <strong>Better Bits signup is not connected on this draft.</strong>
        <span>No name or email address is collected here.</span>
      </div>
      <a
        className="button button--yellow"
        href="https://shows.acast.com/betteratworkpodcast/episodes"
        target="_blank"
        rel="noreferrer"
      >
        Follow the show on Acast <ArrowUpRight aria-hidden="true" />
      </a>
    </div>
  );
}
