import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { landings } from "@/data/landings";
import { getCatalog, getCatalogDates } from "@/lib/catalog";

/**
 * Mapa do site para o Google e o Bing: home, tabela de preços, páginas de
 * categoria, produtos (com a data real da última mudança e a imagem) e termos.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const [products, dates] = await Promise.all([getCatalog(), getCatalogDates()]);
  const times = Object.values(dates).map((d) => new Date(d).getTime());
  const latest = times.length > 0 ? new Date(Math.max(...times)) : undefined;

  return [
    { url: base, lastModified: latest, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/loja`, lastModified: latest, changeFrequency: "weekly", priority: 0.9 },
    ...landings.map((l) => {
      const inCategory = products.filter((p) => p.category === l.category).map((p) => dates[p.slug]).filter(Boolean);
      const last = inCategory.length > 0 ? new Date(Math.max(...inCategory.map((d) => new Date(d).getTime()))) : undefined;
      return {
        url: `${base}/${l.slug}`,
        lastModified: last,
        changeFrequency: "weekly" as const,
        priority: 0.9,
        images: [`${base}/${l.slug}/opengraph-image`],
      };
    }),
    ...products.map((p) => ({
      url: `${base}/loja/${p.slug}`,
      lastModified: dates[p.slug] ? new Date(dates[p.slug]) : undefined,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: [p.image ?? `${base}/loja/${p.slug}/opengraph-image`],
    })),
    { url: `${base}/termos`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
