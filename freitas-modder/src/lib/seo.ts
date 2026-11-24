/**
 * Dados estruturados (schema.org) usados nas páginas. O Google usa para
 * entender a loja, mostrar preço nos resultados e montar as migalhas.
 */
import { siteConfig } from "@/config/site";
import type { FaqItem } from "@/data/faq";
import { categories, platforms, type Product } from "@/data/products";

const url = (path = "") => `${siteConfig.url}${path}`;

/** Corta a descrição para caber no resultado do Google (sem quebrar palavra). */
export function clampDescription(text: string, max = 158) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,.;:]$/, "")}…`;
}

export const STORE_ID = url("/#loja");
export const SITE_ID = url("/#site");

/** A loja (aparece no painel de conhecimento do Google). */
export function storeLd() {
  const { contact } = siteConfig;
  return {
    "@type": "OnlineStore",
    "@id": STORE_ID,
    name: siteConfig.name,
    url: url(),
    description: siteConfig.description,
    logo: url("/icone-512.png"),
    image: url("/opengraph-image"),
    areaServed: { "@type": "Country", name: "Brasil" },
    sameAs: [contact.instagram, contact.discord, contact.tiktok, contact.youtube].filter(Boolean),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: `+${contact.whatsappNumber}`,
      availableLanguage: ["Portuguese"],
      areaServed: "BR",
    },
  };
}

export function websiteLd() {
  return {
    "@type": "WebSite",
    "@id": SITE_ID,
    url: url(),
    name: siteConfig.name,
    inLanguage: "pt-BR",
    publisher: { "@id": STORE_ID },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: url(item.path),
    })),
  };
}

export function itemListLd(products: Product[], name?: string) {
  return {
    "@type": "ItemList",
    ...(name ? { name } : {}),
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: url(`/loja/${p.slug}`),
      name: p.name,
    })),
  };
}

export function faqLd(items: FaqItem[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** Produto com preço por console (o Google mostra o preço nos resultados). */
export function productLd(product: Product) {
  const page = url(`/loja/${product.slug}`);
  return {
    "@type": "Product",
    "@id": `${page}#produto`,
    name: `${product.name} no GTA 5 Online`,
    description: [product.summary, product.description].filter(Boolean).join(" ") || siteConfig.description,
    sku: product.slug,
    url: page,
    image: url(`/loja/${product.slug}/opengraph-image`),
    category: categories[product.category].label,
    brand: { "@type": "Brand", name: siteConfig.name },
    ...(product.variants.length > 0
      ? {
          offers: product.variants.map((v) => ({
            "@type": "Offer",
            name: `${product.name} (${platforms[v.platform].label})`,
            price: v.price.toFixed(2),
            priceCurrency: "BRL",
            availability: "https://schema.org/InStock",
            itemCondition: "https://schema.org/NewCondition",
            url: page,
            seller: { "@id": STORE_ID },
          })),
        }
      : {}),
  };
}

export function graph(...nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
