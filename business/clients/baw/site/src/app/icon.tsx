import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "64px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "3px solid #171817",
          borderRadius: "999px",
          background: "#f4f0e7",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "46px",
            height: "46px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #171817",
            borderRadius: "999px",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: "2px",
              fontFamily: "Courier New, monospace",
              fontSize: "5px",
              fontWeight: 700,
              letterSpacing: "1px",
            }}
          >
            B
          </span>
          <span
            style={{
              position: "absolute",
              bottom: "2px",
              fontFamily: "Courier New, monospace",
              fontSize: "5px",
              fontWeight: 700,
              letterSpacing: "1px",
            }}
          >
            W
          </span>
          <span
            style={{
              position: "absolute",
              left: "2px",
              width: "4px",
              height: "4px",
              borderRadius: "999px",
              background: "#ef6b68",
            }}
          />
          <span
            style={{
              position: "absolute",
              right: "2px",
              width: "4px",
              height: "4px",
              borderRadius: "999px",
              background: "#68c5dc",
            }}
          />
          <div
            style={{
              width: "34px",
              height: "34px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "999px",
              background: "#6a43d5",
              color: "#fffdf8",
              fontFamily: "Georgia, serif",
              fontSize: 31,
              fontStyle: "italic",
              lineHeight: 1,
            }}
          >
            @
          </div>
        </div>
      </div>
    ),
    size,
  );
}
