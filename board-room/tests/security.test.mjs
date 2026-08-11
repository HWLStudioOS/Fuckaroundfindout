import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest, NextResponse } from "next/server.js";
import { GET, PATCH } from "../app/api/board/route.ts";
import { proxy, config as proxyConfig } from "../proxy.ts";
import {
  applyBoardSecurityHeaders,
  boardContentSecurityPolicy,
  isTrustedMutationOrigin,
} from "../security.ts";

function request(path = "/", init = {}) {
  return new NextRequest(`https://board.example${path}`, init);
}

test("requires an exact same-origin Origin on mutations", () => {
  assert.equal(isTrustedMutationOrigin(request("/api/board", {
    method: "PATCH",
    headers: { origin: "https://board.example", "sec-fetch-site": "same-origin" },
  })), true);
  assert.equal(isTrustedMutationOrigin(request("/api/board", { method: "PATCH" })), false);
  assert.equal(isTrustedMutationOrigin(request("/api/board", {
    method: "PATCH",
    headers: { origin: "https://evil.example", "sec-fetch-site": "cross-site" },
  })), false);
  assert.equal(isTrustedMutationOrigin(request("/api/board", {
    method: "PATCH",
    headers: { origin: "https://board.example/" },
  })), false);
  assert.equal(isTrustedMutationOrigin(request("/api/board", {
    method: "PATCH",
    headers: { origin: "null" },
  })), false);
});

test("the proxy allows passwordless pages, APIs and static assets", () => {
  assert.deepEqual(proxyConfig.matcher, ["/:path*"]);

  for (const path of ["/", "/api/board", "/_next/static/chunks/app.js"]) {
    const response = proxy(request(path));
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("www-authenticate"), null);
  }
});

test("the public proxy retains private caching and browser security headers", () => {
  const response = proxy(request("/"));
  assert.equal(response.headers.get("cache-control"), "private, no-store, max-age=0");
  assert.equal(response.headers.get("access-control-allow-origin"), "https://board.example");
  assert.notEqual(response.headers.get("access-control-allow-origin"), "*");
  assert.equal(response.headers.get("cross-origin-resource-policy"), "same-origin");
  assert.equal(response.headers.get("x-frame-options"), "DENY");
  assert.match(response.headers.get("x-robots-tag"), /noindex/);
  assert.match(response.headers.get("content-security-policy"), /nonce-/);
});

test("the API read path no longer issues an authentication challenge", async () => {
  const originalToken = process.env.BLOB_READ_WRITE_TOKEN;
  const originalConsoleError = console.error;
  delete process.env.BLOB_READ_WRITE_TOKEN;
  console.error = () => {};
  try {
    const response = await GET(request("/api/board"));
    assert.equal(response.status, 503);
    assert.equal(response.headers.get("www-authenticate"), null);
    assert.match(response.headers.get("x-robots-tag"), /noindex/);
    assert.deepEqual(await response.json(), { error: "Board state could not be loaded." });
  } finally {
    console.error = originalConsoleError;
    if (originalToken === undefined) delete process.env.BLOB_READ_WRITE_TOKEN;
    else process.env.BLOB_READ_WRITE_TOKEN = originalToken;
  }
});

test("the API validates mutation origin and transport before storage", async () => {
  const missingOrigin = await PATCH(request("/api/board", {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ id: "HWL-192", state: "done" }),
  }));
  assert.equal(missingOrigin.status, 403);

  const crossOrigin = await PATCH(request("/api/board", {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      origin: "https://evil.example",
    },
    body: JSON.stringify({ id: "HWL-192", state: "done" }),
  }));
  assert.equal(crossOrigin.status, 403);

  const wrongContentType = await PATCH(request("/api/board", {
    method: "PATCH",
    headers: {
      "content-type": "text/plain",
      origin: "https://board.example",
    },
    body: "{}",
  }));
  assert.equal(wrongContentType.status, 415);
});

test("the API bounds chunked mutation bodies by actual bytes", async () => {
  const oversizedBody = JSON.stringify({
    id: "HWL-192",
    title: "x".repeat(5000),
  });
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(oversizedBody));
      controller.close();
    },
  });
  const response = await PATCH(request("/api/board", {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      origin: "https://board.example",
    },
    body: stream,
    duplex: "half",
  }));

  assert.equal(response.status, 413);
});

test("security headers never reintroduce a Basic Auth challenge", () => {
  const response = applyBoardSecurityHeaders(
    new NextResponse("ok"),
    "https://board.example",
  );
  assert.equal(response.headers.get("www-authenticate"), null);
  assert.equal(response.headers.get("vary"), null);
  assert.equal(response.headers.get("cache-control"), "private, no-store, max-age=0");
  assert.match(response.headers.get("x-robots-tag"), /noindex/);
});

test("builds a restrictive nonce-based content security policy", () => {
  const policy = boardContentSecurityPolicy("test-nonce");
  assert.match(policy, /default-src 'none'/);
  assert.match(policy, /script-src 'self' 'nonce-test-nonce' 'strict-dynamic'/);
  assert.match(policy, /frame-ancestors 'none'/);
  assert.match(policy, /object-src 'none'/);
  assert.doesNotMatch(policy, /script-src[^;]*'unsafe-inline'/);
});
