import { landingOgImage, landingOgSize } from "@/components/seo/landing-og";

export const size = landingOgSize;
export const contentType = "image/png";
export const alt = "Freitas Modder: GTA 5 Online para PS4 e PS5";

export default function Image() {
  return landingOgImage("up-de-level-gta-5");
}
