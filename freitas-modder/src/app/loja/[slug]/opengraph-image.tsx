import { getProduct, priceOnRequest, products, type Tone } from "@/data/products";
import { ogSize, renderOgImage } from "@/lib/og";
import { formatBRL } from "@/lib/utils";

export const alt = "Produto da Freitas Modder";
export const size = ogSize;
export const contentType = "image/png";

const backgrounds: Record<Tone, { background: string; titleColor: string }> = {
  graphite: { background: "#242427", titleColor: "#ffffff" },
  red: { background: "#e8182c", titleColor: "#ffffff" },
  wine: { background: "#42070e", titleColor: "#ffffff" },
  black: { background: "#09090a", titleColor: "#e8182c" },
};

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    return renderOgImage({ kicker: "GTA V Online · PS4 e PS5", title: "Dinheiro, level e tudo liberado" });
  }

  const price = priceOnRequest(product)
    ? "preço no WhatsApp"
    : formatBRL(Math.min(...product.variants.map((v) => v.price)));

  return renderOgImage({
    kicker: `${product.headline.value} ${product.headline.label} · ${price}`,
    title: product.name,
    footer: product.specs
      .slice(0, 3)
      .map((s) => `${s.label} ${s.value}`)
      .join(" · "),
    ...backgrounds[product.tone],
  });
}
