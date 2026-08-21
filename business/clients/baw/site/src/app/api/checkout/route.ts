import { NextResponse } from "next/server";
import { checkoutConfig } from "@/lib/checkout";
import { absoluteUrl } from "@/lib/site";

// Creates a Stripe Checkout Session for Better Careers. Uses Stripe's REST API
// directly so the draft carries no extra dependency while checkout is dormant.
// Fulfilment (webhook, delivery email) is production scope and is not built here.
export async function POST() {
  const config = checkoutConfig();
  if (!config) {
    return NextResponse.json(
      {
        error: "checkout_not_configured",
        message:
          "Checkout is built but not switched on. No payment can be taken on this draft.",
      },
      { status: 503 },
    );
  }

  const body = new URLSearchParams({
    mode: "payment",
    "line_items[0][price]": config.priceId,
    "line_items[0][quantity]": "1",
    success_url: `${absoluteUrl("/better-careers/success")}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: absoluteUrl("/better-careers"),
  });

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error(`Stripe checkout session failed (${response.status}): ${detail}`);
    return NextResponse.json(
      {
        error: "checkout_unavailable",
        message: "Checkout is temporarily unavailable. Nothing has been charged.",
      },
      { status: 502 },
    );
  }

  const session = (await response.json()) as { url?: string };
  if (!session.url) {
    return NextResponse.json(
      {
        error: "checkout_unavailable",
        message: "Checkout is temporarily unavailable. Nothing has been charged.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ url: session.url });
}
