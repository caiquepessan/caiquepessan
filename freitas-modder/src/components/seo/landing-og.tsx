import { siteConfig } from "@/config/site";
import { getLanding } from "@/data/landings";
import { ogSize, renderOgImage } from "@/lib/og";

export const landingOgSize = ogSize;

/** Imagem de compartilhamento de cada página de categoria. */
export function landingOgImage(slug: string) {
  const landing = getLanding(slug);
  return renderOgImage({
    kicker: landing?.kicker ?? "GTA 5 Online · PS4 e PS5",
    title: landing?.h1 ?? siteConfig.name,
  });
}
