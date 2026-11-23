import { ImageResponse } from "next/og";
import { LOGO_SYMBOL } from "@/components/ui/logo-paths";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const inner = 100;
  const scale = inner / LOGO_SYMBOL.height;
  const width = LOGO_SYMBOL.width * scale;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#E8182C",
        }}
      >
        <svg width={width} height={inner} viewBox={`0 0 ${LOGO_SYMBOL.width} ${LOGO_SYMBOL.height}`} style={{ marginLeft: 4 }}>
          <path fill="#FFFFFF" d={LOGO_SYMBOL.d} />
        </svg>
      </div>
    ),
    size,
  );
}
