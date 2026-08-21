import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="shell">
        <span className="note-label">404 · Not part of the archive</span>
        <h1>This page took the conversation offline.</h1>
        <p>
          The idea you are after probably lives in the episode archive, or the
          Work Problem Finder can look it up from what you are working through.
        </p>
        <div className="hero__actions">
          <Link className="button button--ink" href="/episodes">
            Browse every episode <ArrowRight aria-hidden="true" />
          </Link>
          <Link className="button button--ghost" href="/#find">
            Find an answer <Search aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
