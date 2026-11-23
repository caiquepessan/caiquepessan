import { getProduct, getStartingPrice, products, tiers } from "@/data/products";
import { ogSize, renderOgImage } from "@/lib/og";
import { formatBRL } from "@/lib/utils";

export const alt = "Produto da Freitas Modder";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    return renderOgImage({ eyebrow: "Freitas Modder", title: "Contas modadas", highlight: "de GTA V" });
  }

  const stats = product.stats.map((s) => `${s.value} ${s.label.toLowerCase()}`).join(" • ");

  return renderOgImage({
    eyebrow: `A partir de ${formatBRL(getStartingPrice(product))}`,
    title: product.name,
    accent: tiers[product.tier].accent,
    footer: stats,
  });
}
