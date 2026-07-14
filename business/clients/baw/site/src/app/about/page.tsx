import type { Metadata } from "next";
import { ArrowRight, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Better@Work hosts Cathal Quinlan and Annette Sloan and learn how the show turns conversation into useful action.",
};

export default function AboutPage() {
  return (
    <>
      <section className="about-hero">
        <div className="shell about-hero__grid">
          <div>
            <span className="note-label">Why Better@Work exists</span>
            <h1>Work takes enough from us. The good ideas should give something back.</h1>
          </div>
          <p>
            Better@Work is a conversation about careers, teams, leadership and working life,
            made useful by two people who rarely leave an idea untested.
          </p>
        </div>
      </section>
      <section className="about-duo">
        <div className="shell about-duo__grid">
          <div className="about-duo__image">
            <Image
              src="/assets/cathal-annette.png"
              alt="Cathal Quinlan and Annette Sloan"
              width={400}
              height={600}
              priority
            />
          </div>
          <div>
            <span className="eyebrow">Two voices</span>
            <h2>Cathal asks. Annette tests. Both occasionally change their minds.</h2>
            <p>
              Cathal spent his career leading people and building teams. Annette works with
              people making difficult choices about careers, performance and what a good life
              actually asks of work.
            </p>
            <p>
              Together, they interview authors, researchers and practitioners, then take the
              conversation offline to decide what is useful, what is missing and what a
              listener can try next.
            </p>
            <Link className="button button--ink" href="/episodes">
              Hear the latest conversation <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      <section className="question-callout">
        <div className="shell question-callout__grid">
          <MessageCircle aria-hidden="true" />
          <div>
            <span className="note-label">Bring us the real thing</span>
            <h2>What is happening at work that nobody is naming?</h2>
          </div>
          <Link className="button button--yellow" href="/#find">
            Find an answer <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
