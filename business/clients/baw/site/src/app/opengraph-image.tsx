import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Better at Work. Conversations for the work ahead.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function getLogoDataUri() {
  const logo = await readFile(
    path.join(process.cwd(), "public/assets/better-at-work-logo.svg"),
    "utf8",
  );

  return `data:image/svg+xml;base64,${Buffer.from(logo).toString("base64")}`;
}

export default async function OpenGraphImage() {
  const logo = await getLogoDataUri();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "24px",
          color: "#fff",
          background: "#6a43d5",
        }}
      >
        <img src={logo} alt="" width={760} height={384} />
        <div
          style={{
            display: "flex",
            fontFamily: "Arial, sans-serif",
            fontSize: "25px",
            fontWeight: 700,
            letterSpacing: "4px",
            textTransform: "uppercase",
          }}
        >
          Conversations for the work ahead
        </div>
      </div>
    ),
    size,
  );
}
