import { ogSize, renderOgImage } from "@/lib/og";

export const alt = "Freitas Modder: dinheiro, level e Unlock All no GTA V para PS4 e PS5";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    kicker: "GTA V Online · PS4 e PS5",
    title: "Dinheiro, level e tudo liberado",
  });
}
