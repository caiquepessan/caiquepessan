import { ogSize, renderOgImage } from "@/lib/og";

export const alt = "Freitas Modder: contas modadas de GTA V";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    eyebrow: "Entrega imediata • Garantia • PIX",
    title: "Contas modadas",
    highlight: "de GTA V",
  });
}
