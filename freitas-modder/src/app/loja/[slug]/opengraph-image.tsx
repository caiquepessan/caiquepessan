import { priceOnRequest, type Tone } from "@/data/products";
import { getCatalog, getCatalogProduct } from "@/lib/catalog";
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

export async function generateStaticParams() {
  return (await getCatalog()).map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getCatalogProduct(slug);

  if (!product) {
    return renderOgImage({ kicker: "GTA V Online · PS4 e PS5", title: "Dinheiro, level e tudo liberado" });
  }

  const price = priceOnRequest(product)
    ? "preço no WhatsApp"
    : formatBRL(Math.min(...product.variants.map((v) => v.price)));

  // Legenda e ficha são opcionais no painel: sem elas, a imagem usa o texto padrão.
  const headline = [product.headline.value, product.headline.label].filter(Boolean).join(" ");
  const specs = product.specs
    .slice(0, 3)
    .map((s) => `${s.label} ${s.value}`)
    .join(" · ");

  return renderOgImage({
    kicker: `${headline} · ${price}`,
    title: product.name,
    footer: specs || undefined,
    ...backgrounds[product.tone],
  });
}
