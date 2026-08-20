import Link from "next/link";

const logoSrc = "/assets/better-at-work-logo.svg";

function LogoArtwork() {
  return (
    <img
      className="brand-logo__image"
      src={logoSrc}
      alt=""
      width={827}
      height={418}
      aria-hidden="true"
    />
  );
}

export function Logo() {
  return (
    <Link className="brand-logo" href="/" aria-label="Better at Work home">
      <LogoArtwork />
    </Link>
  );
}

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`brand-mark${className ? ` ${className}` : ""}`}
      aria-label="Better at Work"
      role="img"
    >
      <LogoArtwork />
    </span>
  );
}
