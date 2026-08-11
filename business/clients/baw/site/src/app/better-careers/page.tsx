import type { Metadata } from "next";
import { Check, Download, Lock, Quote, Sparkles } from "lucide-react";
import Image from "next/image";
import { CheckoutButton } from "@/components/CheckoutButton";
import { isCheckoutConfigured, plannedPriceLabel } from "@/lib/checkout";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Better Careers",
  description:
    "A practical six-step process for experienced professionals deciding what comes next.",
  alternates: { canonical: absoluteUrl("/better-careers") },
  openGraph: {
    title: "Better Careers",
    description:
      "A practical six-step process for experienced professionals deciding what comes next.",
    url: absoluteUrl("/better-careers"),
  },
};

const steps = ["Reflect", "Plan", "Network", "Apply", "Interview", "Thrive"];

export default function CareersPage() {
  const checkoutLive = isCheckoutConfigured();
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
              <strong>{plannedPriceLabel}</strong>
              <span>
                {checkoutLive
                  ? "One-off price · Secure checkout by Stripe"
                  : "Planned one-off price · Checkout is built, not yet switched on"}
              </span>
            </div>
            <CheckoutButton
              enabled={checkoutLive}
              label={checkoutLive ? "Buy the guide" : "Checkout coming soon"}
              variant="yellow"
            />
            <small className="prototype-note">
              {checkoutLive ? (
                <>
                  <Lock aria-hidden="true" /> Payment is handled by Stripe. Card
                  details never touch this site.
                </>
              ) : (
                <>
                  <Sparkles aria-hidden="true" /> This draft cannot take payment.
                  Nothing will be charged.
                </>
              )}
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
              <Download aria-hidden="true" /> Digital access when checkout is live
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
            <CheckoutButton
              enabled={checkoutLive}
              label={checkoutLive ? "Buy Better Careers" : "Checkout coming soon"}
              variant="ink"
            />
          </div>
        </div>
      </section>
    </>
  );
}
