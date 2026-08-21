import type { Metadata } from "next";
import { CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";
import { checkoutConfig } from "@/lib/checkout";

export const metadata: Metadata = {
  title: "Better Careers order",
  robots: { index: false, follow: false },
};

async function sessionPaymentStatus(sessionId: string) {
  const config = checkoutConfig();
  if (!config) return null;
  const response = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
    { headers: { Authorization: `Bearer ${config.secretKey}` }, cache: "no-store" },
  );
  if (!response.ok) return null;
  const session = (await response.json()) as { payment_status?: string };
  return session.payment_status ?? null;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  const paymentStatus = sessionId ? await sessionPaymentStatus(sessionId) : null;
  const paid = paymentStatus === "paid";

  return (
    <section className="careers-hero">
      <div className="shell">
        <span className="note-label">Better Careers</span>
        {paid ? (
          <>
            <h1>
              <CheckCircle2 aria-hidden="true" /> Payment received.
            </h1>
            <p>
              Thank you. Stripe has confirmed your payment and will email your
              receipt. If anything about your order looks wrong, reply to that
              receipt and it will be put right.
            </p>
          </>
        ) : (
          <>
            <h1>No payment has been taken.</h1>
            <p>
              This page confirms Better Careers orders once checkout is switched
              on. There is no completed payment to show here.
            </p>
            <small className="prototype-note">
              <Sparkles aria-hidden="true" /> This draft cannot take payment.
            </small>
          </>
        )}
        <p>
          <Link className="button button--ink" href="/better-careers">
            Back to Better Careers
          </Link>
        </p>
      </div>
    </section>
  );
}
