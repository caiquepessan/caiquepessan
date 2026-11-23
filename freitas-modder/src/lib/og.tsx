import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const ogSize = { width: 1200, height: 630 };

// Lidas uma vez, no escopo do módulo: assim as imagens continuam estáticas.
const fontsDir = join(process.cwd(), "src/assets/fonts");
const [condensedFont, textFont] = await Promise.all([
  readFile(join(fontsDir, "BarlowCondensed-ExtraBold.ttf")),
  readFile(join(fontsDir, "Barlow-SemiBold.ttf")),
]);

const fonts = [
  { name: "Condensed", data: condensedFont, weight: 800 as const, style: "normal" as const },
  { name: "Text", data: textFont, weight: 600 as const, style: "normal" as const },
];

function Mark({ size, background, color }: { size: number; background: string; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <rect width="48" height="48" rx="13" fill={background} />
      <path
        d="M17 12.5h17.5v6.25h-10v4.75H33v6H24.5v6h-7.5Z"
        fill={color}
        transform="translate(24 24) skewX(-9) translate(-24 -24)"
      />
    </svg>
  );
}

/** Imagem de compartilhamento (WhatsApp, Discord, redes). */
export function renderOgImage({
  kicker,
  title,
  footer,
  background = "#e8182c",
  titleColor = "#ffffff",
}: {
  kicker: string;
  title: string;
  footer?: string;
  background?: string;
  titleColor?: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background,
          color: "#ffffff",
          fontFamily: "Text",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Mark
            size={60}
            background={background === "#e8182c" ? "#09090a" : "#e8182c"}
            color="#ffffff"
          />
          <span style={{ fontFamily: "Condensed", fontSize: 40, letterSpacing: 0.5 }}>
            FREITAS MODDER
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 30, opacity: 0.85, marginBottom: 8 }}>{kicker}</span>
          <span
            style={{
              fontFamily: "Condensed",
              fontSize: 132,
              lineHeight: 0.9,
              textTransform: "uppercase",
              color: titleColor,
              maxWidth: 1050,
            }}
          >
            {title}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 40,
            borderTop: "2px solid rgba(255,255,255,0.3)",
            paddingTop: 22,
            fontSize: 26,
          }}
        >
          <span style={{ opacity: 0.9, maxWidth: 760 }}>
            {footer ?? "PS4 e PS5 · Pix · Entrega pelo WhatsApp"}
          </span>
          <span>{siteConfig.url.replace(/^https?:\/\//, "")}</span>
        </div>
      </div>
    ),
    { ...ogSize, fonts },
  );
}
