import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { products } from "@/data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/contas`, changeFrequency: "weekly", priority: 0.9 },
    ...products.map((p) => ({
      url: `${base}/contas/${p.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    { url: `${base}/termos`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
