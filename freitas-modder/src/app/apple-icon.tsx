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
          background: "#e8182c",
        }}
      >
        <svg width={150} height={150} viewBox="0 0 48 48">
          <path
            d="M17 12.5h17.5v6.25h-10v4.75H33v6H24.5v6h-7.5Z"
            fill="#ffffff"
            transform="translate(24 24) skewX(-9) translate(-24 -24)"
          />
        </svg>
      </div>
    ),
    size,
  );
}
