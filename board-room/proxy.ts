import { NextRequest, NextResponse } from "next/server.js";
import {
  applyBoardSecurityHeaders,
  boardContentSecurityPolicy,
} from "./security.ts";

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID(), "utf8").toString("base64");
  const contentSecurityPolicy = boardContentSecurityPolicy(nonce);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("Content-Security-Policy", contentSecurityPolicy);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  return applyBoardSecurityHeaders(response, request.nextUrl.origin, contentSecurityPolicy);
}

export const config = {
  matcher: ["/:path*"],
};
