import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const ogSize = { width: 1200, height: 630 };

// Lidas uma vez, no escopo do módulo: assim as imagens continuam estáticas.
const fontsDir = join(process.cwd(), "src/assets/fonts");
const [antonFont, chakraFont] = await Promise.all([
  readFile(join(fontsDir, "Anton-Regular.ttf")),
  readFile(join(fontsDir, "ChakraPetch-SemiBold.ttf")),
]);

const fonts = [
  { name: "Anton", data: antonFont, weight: 400 as const, style: "normal" as const },
  { name: "Chakra", data: chakraFont, weight: 600 as const, style: "normal" as const },
];

function Hexagon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <path d="M24 2.5 42.6 13.25v21.5L24 45.5 5.4 34.75v-21.5Z" fill="#ff2a47" />
      <path d="M24 6.4 39.2 15.2v17.6L24 41.6 8.8 32.8V15.2Z" fill="#0b0607" />
      <path d="M16.5 13.5h17.5l-2.7 5.3h-8.8v3.7h7.9l-2.6 5.1h-5.3v7.9h-6Z" fill="#ff2a47" />
    </svg>
  );
}

/** Imagem de compartilhamento (WhatsApp, Discord, redes) no visual da loja. */
export function renderOgImage({
  eyebrow,
  title,
  highlight,
  footer,
  accent = "#ff2a47",
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  footer?: string;
  accent?: string;
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
          backgroundColor: "#060304",
          backgroundImage: `radial-gradient(circle at 85% 20%, ${accent}55 0%, transparent 45%), radial-gradient(circle at 10% 110%, #c8052a66 0%, transparent 50%)`,
          color: "#fbf6f7",
          fontFamily: "Chakra",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Hexagon size={64} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: "Anton", fontSize: 40, letterSpacing: 2, lineHeight: 1 }}>
              FREITAS
            </span>
            <span style={{ fontSize: 16, letterSpacing: 9, color: "#ff2a47" }}>MODDER</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: 22,
              letterSpacing: 8,
              color: accent,
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            {eyebrow}
          </span>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontFamily: "Anton",
              fontSize: 112,
              lineHeight: 0.95,
              textTransform: "uppercase",
              maxWidth: 1000,
            }}
          >
            <span style={{ marginRight: 24 }}>{title}</span>
            {highlight && <span style={{ color: accent }}>{highlight}</span>}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "2px solid rgba(255,255,255,0.08)",
            paddingTop: 24,
            fontSize: 24,
            color: "#b09ea2",
          }}
        >
          <span>{footer ?? "PC • PlayStation • Xbox"}</span>
          <span style={{ color: "#fbf6f7" }}>
            {siteConfig.url.replace(/^https?:\/\//, "")}
          </span>
        </div>
      </div>
    ),
    { ...ogSize, fonts },
  );
}
