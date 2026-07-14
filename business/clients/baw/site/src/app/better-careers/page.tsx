import type { Metadata } from "next";
import { ArrowRight, Check, Download, Quote, Sparkles } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Better Careers",
  description:
    "A practical six-step process for experienced professionals deciding what comes next.",
};

const steps = ["Reflect", "Plan", "Network", "Apply", "Interview", "Thrive"];

export default function CareersPage() {
  return (
    <>
      <section className="careers-hero">
        <div className="shell careers-hero__grid">
          <div>
            <span className="note-label">Better Careers</span>
            <h1>Your career is allowed to change shape.</h1>
            <p>
              A clear, practical six-step reset for experienced people deciding what comes
              next, without pretending the answer arrives in one brave leap.
            </p>
            <div className="careers-hero__price">
              <strong>£20</strong>
              <span>One payment · Instant digital access</span>
            </div>
            <button className="button button--yellow" type="button">
              Get Better Careers <ArrowRight aria-hidden="true" />
            </button>
            <small className="prototype-note">
              <Sparkles aria-hidden="true" /> Prototype checkout. Stripe is connected after
              approval.
            </small>
          </div>
          <div className="careers-hero__product">
            <div className="careers-hero__halo" />
            <Image
              src="/assets/better-careers.jpg"
              alt="Better Careers digital guide"
              width={500}
              height={750}
              priority
            />
            <div className="careers-hero__badge">Six steps. Yours to keep.</div>
          </div>
        </div>
      </section>
      <section className="career-steps">
        <div className="shell">
          <div className="section-heading section-heading--split">
            <div>
              <span className="eyebrow">The process</span>
              <h2>From “something needs to change” to a move you can trust.</h2>
            </div>
            <p>Use it from start to finish, or begin with the step that is noisy now.</p>
          </div>
          <ol>
            {steps.map((step, index) => (
              <li key={step}>
                <span>0{index + 1}</span>
                <strong>{step}</strong>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="careers-includes">
        <div className="shell careers-includes__grid">
          <div>
            <span className="note-label">Inside the guide</span>
            <h2>Not another career pep talk.</h2>
            <p>
              Better Careers is a working document. It helps you make sense of where you
              are, build a credible plan and prepare for the conversations ahead.
            </p>
          </div>
          <ul>
            <li>
              <Check aria-hidden="true" /> Six structured modules
            </li>
            <li>
              <Check aria-hidden="true" /> Reflection and planning prompts
            </li>
            <li>
              <Check aria-hidden="true" /> Network and interview templates
            </li>
            <li>
              <Check aria-hidden="true" /> Downloadable, reusable worksheets
            </li>
            <li>
              <Download aria-hidden="true" /> Immediate digital access
            </li>
          </ul>
        </div>
      </section>
      <section className="careers-proof">
        <div className="shell careers-proof__grid">
          <Quote aria-hidden="true" />
          <blockquote>
            <p>
              “The Better Careers Guide provides valuable insights to progress in your
              career. It equips you with effective strategies, from gaining self-awareness
              to building connections and excelling in interviews.”
            </p>
            <cite>Oli Coles · Founder & CEO, Windō</cite>
          </blockquote>
          <div>
            <strong>Ready when you are.</strong>
            <p>One payment. No membership. Keep the guide and return whenever work shifts.</p>
            <button className="button button--ink" type="button">
              Get Better Careers for £20 <ArrowRight aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
