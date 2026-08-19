import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

async function getLogoDataUri() {
  const logo = await readFile(
    path.join(process.cwd(), "public/assets/better-at-work-logo.svg"),
    "utf8",
  );

  return `data:image/svg+xml;base64,${Buffer.from(logo).toString("base64")}`;
}

export default async function Icon() {
  const logo = await getLogoDataUri();

  return new ImageResponse(
    (
      <div
        style={{
          width: "64px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#6a43d5",
        }}
      >
        <img src={logo} alt="" width={58} height={29} />
      </div>
    ),
    size,
  );
}
