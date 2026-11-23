import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { LOGO_LOCKUP, LOGO_SYMBOL } from "@/components/ui/logo-paths";
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

/** Logo completa (símbolo + nome) para as imagens. */
function Lockup({ height, symbolColor }: { height: number; symbolColor: string }) {
  const { width, height: h, symbolScale, textX, textY, freitas, modder } = LOGO_LOCKUP;
  return (
    <svg width={(width / h) * height} height={height} viewBox={`0 0 ${width} ${h}`}>
      <path fill={symbolColor} transform={`scale(${symbolScale})`} d={LOGO_SYMBOL.d} />
      <g transform={`translate(${textX} ${textY})`}>
        <path fill="#ffffff" d={freitas} />
        <path fill="#ffffff" d={modder} />
      </g>
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
        <div style={{ display: "flex" }}>
          <Lockup height={52} symbolColor={background === "#e8182c" ? "#ffffff" : "#E8182C"} />
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
