import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at 50% 30%, #4b0011 0%, #060304 75%)",
        }}
      >
        <svg width={132} height={132} viewBox="0 0 48 48">
          <path d="M24 2.5 42.6 13.25v21.5L24 45.5 5.4 34.75v-21.5Z" fill="#ff2a47" />
          <path d="M24 6.4 39.2 15.2v17.6L24 41.6 8.8 32.8V15.2Z" fill="#0b0607" />
          <path d="M16.5 13.5h17.5l-2.7 5.3h-8.8v3.7h7.9l-2.6 5.1h-5.3v7.9h-6Z" fill="#ff2a47" />
        </svg>
      </div>
    ),
    size,
  );
}
