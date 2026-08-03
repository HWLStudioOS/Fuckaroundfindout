import { createHash, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server.js";

const MINIMUM_PASSWORD_LENGTH = 20;
const MAXIMUM_CREDENTIAL_LENGTH = 1024;

type AuthenticationResult = "authorised" | "misconfigured" | "unauthorised";

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

function configuredCredentials() {
  const username = process.env.BOARD_ROOM_USER;
  const password = process.env.BOARD_ROOM_PASSWORD;

  if (
    !username
    || username.length > 128
    || username !== username.trim()
    || username.includes(":")
    || /[\u0000-\u001f\u007f]/.test(username)
    || !password
    || password.length < MINIMUM_PASSWORD_LENGTH
    || password.length > MAXIMUM_CREDENTIAL_LENGTH
    || /[\r\n\u0000]/.test(password)
  ) {
    return null;
  }

  return { username, password };
}

function decodeBasicCredentials(header: string | null) {
  const match = header?.match(/^Basic ([A-Za-z0-9+/]+={0,2})$/i);
  if (!match) return null;

  try {
    const encoded = match[1];
    const bytes = Buffer.from(encoded, "base64");
    const canonical = bytes.toString("base64").replace(/=+$/, "");
    if (!bytes.length || canonical !== encoded.replace(/=+$/, "")) return null;

    const decoded = bytes.toString("utf8");
    if (!Buffer.from(decoded, "utf8").equals(bytes)) return null;

    const separator = decoded.indexOf(":");
    if (separator <= 0) return null;
    return {
      username: decoded.slice(0, separator),
      password: decoded.slice(separator + 1),
    };
  } catch {
    return null;
  }
}

export function authenticateBoardRequest(request: Pick<Request, "headers">): AuthenticationResult {
  const configured = configuredCredentials();
  if (!configured) return "misconfigured";

  const supplied = decodeBasicCredentials(request.headers.get("authorization")) ?? {
    username: "",
    password: "",
  };
  const usernameMatches = securelyEqual(supplied.username, configured.username);
  const passwordMatches = securelyEqual(supplied.password, configured.password);
  return usernameMatches && passwordMatches ? "authorised" : "unauthorised";
}

function mergeVary(headers: Headers, value: string) {
  const current = headers.get("Vary")
    ?.split(",")
    .map((entry) => entry.trim())
    .filter(Boolean) ?? [];
  if (!current.some((entry) => entry.toLowerCase() === value.toLowerCase())) current.push(value);
  headers.set("Vary", current.join(", "));
}

export function applyBoardSecurityHeaders(
  response: NextResponse,
  requestOrigin: string,
  contentSecurityPolicy = "default-src 'none'; base-uri 'none'; frame-ancestors 'none'",
) {
  for (const [name, value] of SECURITY_HEADERS) response.headers.set(name, value);
  response.headers.set("Access-Control-Allow-Origin", requestOrigin);
  response.headers.set("Content-Security-Policy", contentSecurityPolicy);
  mergeVary(response.headers, "Authorization");
  return response;
}

export function authenticationFailureResponse(request: NextRequest) {
  const result = authenticateBoardRequest(request);
  if (result === "authorised") return null;

  const misconfigured = result === "misconfigured";
  const response = new NextResponse(
    misconfigured ? "The Board Room is not configured." : "The Board Room is private.",
    {
      status: misconfigured ? 503 : 401,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    },
  );
  if (!misconfigured) {
    response.headers.set("WWW-Authenticate", 'Basic realm="The Board Room", charset="UTF-8"');
  }
  return applyBoardSecurityHeaders(response, request.nextUrl.origin);
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
