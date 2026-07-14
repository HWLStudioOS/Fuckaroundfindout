"use client";

import { ArrowRight, Check } from "lucide-react";
import { type FormEvent, useState } from "react";

export function NewsletterForm() {
  const [sent, setSent] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <div className="newsletter-success" role="status">
        <Check aria-hidden="true" />
        <div>
          <strong>You are on the prototype list.</strong>
          <span>No data was stored. The production version will connect to Kit.</span>
        </div>
      </div>
    );
  }

  return (
    <form className="newsletter-form" onSubmit={submit}>
      <label>
        <span>First name</span>
        <input name="firstName" autoComplete="given-name" placeholder="Annette" required />
      </label>
      <label>
        <span>Email address</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="annette@example.com"
          required
        />
      </label>
      <button className="button button--yellow" type="submit">
        Send me Better Bits <ArrowRight aria-hidden="true" />
      </button>
      <small>One useful note each week. Leave whenever you like.</small>
    </form>
  );
}
