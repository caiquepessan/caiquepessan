import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/**
 * Buscadores e assistentes de IA podem ler a loja toda. Painel e tickets
 * ficam fora do Google pela marcação "noindex" das próprias páginas.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
