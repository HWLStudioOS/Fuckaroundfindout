import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server.js";
import { GET, PATCH } from "../app/api/board/route.ts";
import { proxy, config as proxyConfig } from "../proxy.ts";
import {
  authenticateBoardRequest,
  boardContentSecurityPolicy,
  isTrustedMutationOrigin,
} from "../security.ts";

const VALID_USER = "harrison";
const VALID_PASSWORD = "a-secure-32-character-test-password";

function basicAuthorization(username = VALID_USER, password = VALID_PASSWORD) {
  return `Basic ${Buffer.from(`${username}:${password}`, "utf8").toString("base64")}`;
}

async function withCredentials(values, callback) {
  const originalUser = process.env.BOARD_ROOM_USER;
  const originalPassword = process.env.BOARD_ROOM_PASSWORD;
  if (values.username === undefined) delete process.env.BOARD_ROOM_USER;
  else process.env.BOARD_ROOM_USER = values.username;
  if (values.password === undefined) delete process.env.BOARD_ROOM_PASSWORD;
  else process.env.BOARD_ROOM_PASSWORD = values.password;

  try {
    return await callback();
  } finally {
    if (originalUser === undefined) delete process.env.BOARD_ROOM_USER;
    else process.env.BOARD_ROOM_USER = originalUser;
    if (originalPassword === undefined) delete process.env.BOARD_ROOM_PASSWORD;
    else process.env.BOARD_ROOM_PASSWORD = originalPassword;
  }
}

function request(path = "/", init = {}) {
  return new NextRequest(`https://board.example${path}`, init);
}

test("fails closed when Board Room credentials are absent or invalid", async () => {
  await withCredentials({}, () => {
    assert.equal(authenticateBoardRequest(request()), "misconfigured");
  });
  await withCredentials({ username: VALID_USER, password: "too-short" }, () => {
    assert.equal(authenticateBoardRequest(request()), "misconfigured");
  });
  await withCredentials({ username: "bad:user", password: VALID_PASSWORD }, () => {
    assert.equal(authenticateBoardRequest(request()), "misconfigured");
  });
});

test("accepts only the configured Basic credentials", async () => {
  await withCredentials({ username: VALID_USER, password: VALID_PASSWORD }, () => {
    const authorised = request("/", { headers: { authorization: basicAuthorization() } });
    const wrongPassword = request("/", {
      headers: { authorization: basicAuthorization(VALID_USER, `${VALID_PASSWORD}!`) },
    });
    const malformed = request("/", { headers: { authorization: "Basic not:base64" } });

    assert.equal(authenticateBoardRequest(authorised), "authorised");
    assert.equal(authenticateBoardRequest(wrongPassword), "unauthorised");
    assert.equal(authenticateBoardRequest(malformed), "unauthorised");
    assert.equal(authenticateBoardRequest(request()), "unauthorised");
  });
});

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

test("the proxy protects pages, APIs and static assets", async () => {
  assert.deepEqual(proxyConfig.matcher, ["/:path*"]);

  await withCredentials({}, () => {
    const response = proxy(request("/_next/static/chunks/app.js"));
    assert.equal(response.status, 503);
    assert.equal(response.headers.get("cache-control"), "private, no-store, max-age=0");
  });

  await withCredentials({ username: VALID_USER, password: VALID_PASSWORD }, () => {
    const denied = proxy(request("/api/board"));
    assert.equal(denied.status, 401);
    assert.match(denied.headers.get("www-authenticate"), /^Basic /);

    const authorised = proxy(request("/", {
      headers: { authorization: basicAuthorization() },
    }));
    assert.equal(authorised.status, 200);
    assert.equal(authorised.headers.get("access-control-allow-origin"), "https://board.example");
    assert.notEqual(authorised.headers.get("access-control-allow-origin"), "*");
    assert.equal(authorised.headers.get("cross-origin-resource-policy"), "same-origin");
    assert.equal(authorised.headers.get("x-frame-options"), "DENY");
    assert.match(authorised.headers.get("content-security-policy"), /nonce-/);
  });
});

test("the API independently authenticates reads", async () => {
  await withCredentials({}, async () => {
    const response = await GET(request("/api/board"));
    assert.equal(response.status, 503);
  });

  await withCredentials({ username: VALID_USER, password: VALID_PASSWORD }, async () => {
    const response = await GET(request("/api/board"));
    assert.equal(response.status, 401);
    assert.match(response.headers.get("www-authenticate"), /^Basic /);
    assert.equal(response.headers.get("access-control-allow-origin"), "https://board.example");
  });
});

test("the API authenticates before validating mutation requests", async () => {
  await withCredentials({ username: VALID_USER, password: VALID_PASSWORD }, async () => {
    const unauthorised = await PATCH(request("/api/board", {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        origin: "https://board.example",
      },
      body: JSON.stringify({ id: "HWL-192", state: "done" }),
    }));
    assert.equal(unauthorised.status, 401);

    const missingOrigin = await PATCH(request("/api/board", {
      method: "PATCH",
      headers: {
        authorization: basicAuthorization(),
        "content-type": "application/json",
      },
      body: JSON.stringify({ id: "HWL-192", state: "done" }),
    }));
    assert.equal(missingOrigin.status, 403);

    const crossOrigin = await PATCH(request("/api/board", {
      method: "PATCH",
      headers: {
        authorization: basicAuthorization(),
        "content-type": "application/json",
        origin: "https://evil.example",
      },
      body: JSON.stringify({ id: "HWL-192", state: "done" }),
    }));
    assert.equal(crossOrigin.status, 403);

    const wrongContentType = await PATCH(request("/api/board", {
      method: "PATCH",
      headers: {
        authorization: basicAuthorization(),
        "content-type": "text/plain",
        origin: "https://board.example",
      },
      body: "{}",
    }));
    assert.equal(wrongContentType.status, 415);
  });
});

test("builds a restrictive nonce-based content security policy", () => {
  const policy = boardContentSecurityPolicy("test-nonce");
  assert.match(policy, /default-src 'none'/);
  assert.match(policy, /script-src 'self' 'nonce-test-nonce' 'strict-dynamic'/);
  assert.match(policy, /frame-ancestors 'none'/);
  assert.match(policy, /object-src 'none'/);
  assert.doesNotMatch(policy, /script-src[^;]*'unsafe-inline'/);
});
