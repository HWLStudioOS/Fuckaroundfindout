import Link from "next/link";

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link
      className={`brand${inverse ? " brand--inverse" : ""}`}
      href="/"
    >
      <span className="brand__capsule">Better</span>
      <span className="brand__at">@</span>
      <span className="brand__capsule">Work</span>
    </Link>
  );
}
