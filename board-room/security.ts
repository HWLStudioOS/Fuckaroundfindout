import { createHash, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server.js";

const SECURITY_HEADERS: ReadonlyArray<readonly [string, string]> = [
  ["Cache-Control", "private, no-store, max-age=0"],
  ["Cross-Origin-Opener-Policy", "same-origin"],
  ["Cross-Origin-Resource-Policy", "same-origin"],
  ["Expires", "0"],
  ["Origin-Agent-Cluster", "?1"],
  [
    "Permissions-Policy",
    "accelerometer=(), autoplay=(), camera=(), geolocation=(), gyroscope=(), microphone=(), payment=(), usb=()",
  ],
  ["Pragma", "no-cache"],
  ["Referrer-Policy", "no-referrer"],
  ["Strict-Transport-Security", "max-age=63072000; includeSubDomains"],
  ["X-Content-Type-Options", "nosniff"],
  ["X-Frame-Options", "DENY"],
  ["X-Permitted-Cross-Domain-Policies", "none"],
  ["X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet"],
];

function sha256(value: string) {
  return createHash("sha256").update(value, "utf8").digest();
}

function securelyEqual(left: string, right: string) {
  return timingSafeEqual(sha256(left), sha256(right));
}

export function applyBoardSecurityHeaders(
  response: NextResponse,
  requestOrigin: string,
  contentSecurityPolicy = "default-src 'none'; base-uri 'none'; frame-ancestors 'none'",
) {
  for (const [name, value] of SECURITY_HEADERS) response.headers.set(name, value);
  response.headers.set("Access-Control-Allow-Origin", requestOrigin);
  response.headers.set("Content-Security-Policy", contentSecurityPolicy);
  return response;
}

export function isTrustedMutationOrigin(request: NextRequest) {
  const suppliedOrigin = request.headers.get("origin");
  if (!suppliedOrigin || suppliedOrigin === "null") return false;

  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin") return false;

  try {
    const parsed = new URL(suppliedOrigin);
    if (parsed.origin !== suppliedOrigin) return false;
    if (parsed.username || parsed.password) return false;
    if (process.env.NODE_ENV === "production" && parsed.protocol !== "https:") return false;
    return securelyEqual(parsed.origin, request.nextUrl.origin);
  } catch {
    return false;
  }
}

export function boardContentSecurityPolicy(nonce: string) {
  const scriptSources = ["'self'", `'nonce-${nonce}'`, "'strict-dynamic'"];
  if (process.env.NODE_ENV === "development") scriptSources.push("'unsafe-eval'");

  return [
    "default-src 'none'",
    "base-uri 'none'",
    "connect-src 'self'",
    "font-src 'self' data:",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "img-src 'self' data:",
    "manifest-src 'self'",
    "media-src 'self'",
    "object-src 'none'",
    `script-src ${scriptSources.join(" ")}`,
    "style-src 'self' 'unsafe-inline'",
    "worker-src 'self' blob:",
    ...(process.env.NODE_ENV === "production" ? ["upgrade-insecure-requests"] : []),
  ].join("; ");
}
