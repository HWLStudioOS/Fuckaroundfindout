import Link from "next/link";

function MastheadArtwork({ showMeta = true }: { showMeta?: boolean }) {
  return (
    <span className="brand-masthead__art" aria-hidden="true">
      <span className="brand-masthead__rule" />
      <span className="brand-masthead__wordline">
        <strong>Better</strong>
        <em>@</em>
        <strong>Work</strong>
      </span>
      <span className="brand-masthead__rule" />
      {showMeta ? (
        <span className="brand-masthead__meta">
          <span>S05 / Conversations for the work ahead</span>
          <span>Better at Work</span>
        </span>
      ) : null}
    </span>
  );
}

export function Logo({
  inverse = false,
  showMeta = true,
}: {
  inverse?: boolean;
  showMeta?: boolean;
}) {
  return (
    <Link
      className={`brand-masthead${inverse ? " brand-masthead--inverse" : ""}`}
      href="/"
      aria-label="Better at Work home"
    >
      <MastheadArtwork showMeta={showMeta} />
    </Link>
  );
}

export function LiveMark({ inverse = false }: { inverse?: boolean }) {
  return (
    <span
      className={`brand-live${inverse ? " brand-live--inverse" : ""}`}
      aria-label="Better at Work"
      role="img"
    >
      <span className="brand-live__capsule brand-live__capsule--better">Better</span>
      <span className="brand-live__at">@</span>
      <span className="brand-live__capsule brand-live__capsule--work">Work</span>
      <span className="brand-live__baseline" aria-hidden="true" />
      <span className="brand-live__label" aria-hidden="true">
        Live mark / rebalanced
      </span>
    </span>
  );
}

export function BrandSeal({ inverse = false }: { inverse?: boolean }) {
  return (
    <span
      className={`brand-seal${inverse ? " brand-seal--inverse" : ""}`}
      aria-label="Better at Work, season five"
      role="img"
    >
      <span className="brand-seal__outer">
        <span className="brand-seal__inner">
          <span className="brand-seal__top">Better</span>
          <span className="brand-seal__dot brand-seal__dot--left" aria-hidden="true" />
          <span className="brand-seal__field">@</span>
          <span className="brand-seal__dot brand-seal__dot--right" aria-hidden="true" />
          <span className="brand-seal__bottom">Work</span>
        </span>
      </span>
      <span className="brand-seal__season" aria-hidden="true">S05</span>
      <span className="brand-seal__year" aria-hidden="true">2026</span>
    </span>
  );
}
