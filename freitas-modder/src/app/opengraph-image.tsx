import { ogSize, renderOgImage } from "@/lib/og";

export const alt = "Freitas Modder: contas modadas de GTA V para PS4 e PS5";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    kicker: "GTA V Online · PS4 e PS5",
    title: "Conta modada, pronta pra jogar",
  });
}
