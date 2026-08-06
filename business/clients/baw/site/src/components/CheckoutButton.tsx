"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

type CheckoutState = "idle" | "pending" | "notice";

export function CheckoutButton({
  label,
  variant = "yellow",
}: {
  label: string;
  variant?: "yellow" | "ink";
}) {
  const [state, setState] = useState<CheckoutState>("idle");
  const [notice, setNotice] = useState("");

  const startCheckout = async () => {
    setState("pending");
    try {
      const response = await fetch("/api/checkout", { method: "POST" });
      const data = (await response.json()) as { url?: string; message?: string };
      if (response.ok && data.url) {
        window.location.assign(data.url);
        return;
      }
      setNotice(
        data.message ??
          "Checkout is temporarily unavailable. Nothing has been charged.",
      );
    } catch {
      setNotice("Checkout is temporarily unavailable. Nothing has been charged.");
    }
    setState("notice");
  };

  return (
    <div className="checkout-action">
      <button
        className={`button button--${variant}`}
        type="button"
        onClick={startCheckout}
        disabled={state === "pending"}
      >
        {state === "pending" ? "Opening checkout…" : label}{" "}
        <ArrowRight aria-hidden="true" />
      </button>
      <p className="checkout-action__notice" role="status" aria-live="polite">
        {state === "notice" ? notice : null}
      </p>
    </div>
  );
}
