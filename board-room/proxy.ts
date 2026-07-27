import { NextRequest, NextResponse } from "next/server";

function deny() {
  return new NextResponse("The Board Room is private.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="The Board Room", charset="UTF-8"',
      "Cache-Control": "no-store",
    },
  });
}

export function proxy(request: NextRequest) {
  const username = process.env.BOARD_ROOM_USER;
  const password = process.env.BOARD_ROOM_PASSWORD;

  if (!username || !password) {
    if (process.env.NODE_ENV === "development") return NextResponse.next();
    return new NextResponse("The Board Room is not configured.", { status: 503 });
  }

  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Basic ")) return deny();

  try {
    const decoded = atob(authorization.slice(6));
    const separator = decoded.indexOf(":");
    const suppliedUser = decoded.slice(0, separator);
    const suppliedPassword = decoded.slice(separator + 1);
    if (suppliedUser === username && suppliedPassword === password) {
      const response = NextResponse.next();
      response.headers.set("Cache-Control", "private, no-store");
      return response;
    }
  } catch {
    return deny();
  }

  return deny();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|og.png).*)"],
};
