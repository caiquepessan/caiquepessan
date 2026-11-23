/**
 * Rascunho do produto no formulário do painel. Fica fora do servidor
 * de propósito: o formulário usa para a prévia e a Server Action usa
 * para validar de verdade.
 */
import {
  categories,
  type Category,
  type Product,
  type ProductVariant,
  type Tone,
} from "@/data/products";

export interface Draft {
  id?: string;
  name: string;
  slug: string;
  category: Category;
  summary: string;
  description: string;
  headlineValue: string;
  headlineLabel: string;
  /** Texto do campo (ex.: "500000000"); vazio = sem contador. */
  amount: string;
  specs: { label: string; value: string }[];
  /** Uma linha por item. */
  includes: string;
  /** Texto do campo (ex.: "35,00"); vazio = não vende nesse console. */
  pricePs4: string;
  pricePs5: string;
  /** Preço combinado no WhatsApp (ignora os preços). */
  onRequest: boolean;
  delivery: string;
  tone: Tone;
  tag: string;
  image: string;
  active: boolean;
}

export const tones: { value: Tone; label: string }[] = [
  { value: "graphite", label: "Grafite" },
  { value: "red", label: "Vermelho" },
  { value: "wine", label: "Vinho" },
  { value: "black", label: "Preto" },
];

export function emptyDraft(category: Category = "dinheiro"): Draft {
  return {
    name: "",
    slug: "",
    category,
    summary: "",
    description: "",
    headlineValue: "",
    headlineLabel: "",
    amount: "",
    specs: [{ label: "", value: "" }],
    includes: "",
    pricePs4: "",
    pricePs5: "",
    onRequest: false,
    delivery: "Rápida",
    tone: "graphite",
    tag: "",
    image: "",
    active: true,
  };
}

const formatMoney = (value: number) =>
  value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function productToDraft(product: Product, active = true): Draft {
  const price = (platform: "ps4" | "ps5") => {
    const variant = product.variants.find((v) => v.platform === platform);
    return variant ? formatMoney(variant.price) : "";
  };
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    category: product.category,
    summary: product.summary,
    description: product.description,
    headlineValue: product.headline.value,
    headlineLabel: product.headline.label,
    amount: product.amount ? String(product.amount) : "",
    specs: product.specs.length > 0 ? product.specs : [{ label: "", value: "" }],
    includes: product.includes.join("\n"),
    pricePs4: price("ps4"),
    pricePs5: price("ps5"),
    onRequest: product.variants.length === 0,
    delivery: product.delivery,
    tone: product.tone,
    tag: product.tag ?? "",
    image: product.image ?? "",
    active,
  };
}

/** "Conta Level 120" -> "conta-level-120" */
export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\$/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** "R$ 1.234,90" -> 1234.9 ; vazio -> null ; inválido -> NaN */
export function parseBRL(text: string): number | null {
  const clean = text.replace(/R\$|\s/g, "").trim();
  if (!clean) return null;
  const normalized = clean.includes(",") ? clean.replace(/\./g, "").replace(",", ".") : clean;
  const value = Number(normalized);
  return Number.isFinite(value) ? value : NaN;
}

export type DraftErrors = Partial<Record<keyof Draft | "form", string>>;

/** Produto pronto para gravar, ou a lista de erros por campo. */
export function validateDraft(
  draft: Draft,
): { product: Product; errors?: undefined } | { product?: undefined; errors: DraftErrors } {
  const errors: DraftErrors = {};
  const name = draft.name.trim();
  if (!name) errors.name = "Dê um nome ao produto.";
  if (!(draft.category in categories)) errors.category = "Escolha a categoria.";

  const slug = slugify(draft.slug.trim() || name);
  if (!slug) errors.slug = "Endereço inválido.";

  const variants: ProductVariant[] = [];
  if (!draft.onRequest) {
    for (const platform of ["ps4", "ps5"] as const) {
      const text = platform === "ps4" ? draft.pricePs4 : draft.pricePs5;
      const value = parseBRL(text);
      if (value === null) continue;
      if (Number.isNaN(value) || value <= 0) {
        errors[platform === "ps4" ? "pricePs4" : "pricePs5"] = "Preço inválido. Ex.: 35,00";
      } else {
        variants.push({ platform, price: Math.round(value * 100) / 100 });
      }
    }
    if (variants.length === 0 && !errors.pricePs4 && !errors.pricePs5) {
      errors.pricePs4 = "Coloque o preço de pelo menos um console, ou marque “Preço no WhatsApp”.";
    }
  }

  let amount: number | undefined;
  if (draft.amount.trim()) {
    const value = Number(draft.amount.replace(/\D/g, ""));
    if (!Number.isSafeInteger(value) || value <= 0) errors.amount = "Use só números. Ex.: 500000000";
    else amount = value;
  }

  if (Object.keys(errors).length > 0) return { errors };

  return {
    product: {
      id: draft.id,
      slug,
      name,
      summary: draft.summary.trim(),
      description: draft.description.trim(),
      category: draft.category,
      headline: {
        value: draft.headlineValue.trim() || name,
        label: draft.headlineLabel.trim(),
      },
      amount,
      specs: draft.specs
        .map((s) => ({ label: s.label.trim(), value: s.value.trim() }))
        .filter((s) => s.label && s.value),
      includes: draft.includes
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      variants,
      delivery: draft.delivery.trim() || "Rápida",
      tone: draft.tone,
      tag: draft.tag.trim() || undefined,
      image: draft.image.trim() || undefined,
    },
  };
}

/** Versão "melhor esforço" para a prévia (não trava com campo incompleto). */
export function draftPreview(draft: Draft): Product {
  const result = validateDraft({ ...draft, name: draft.name || "Nome do produto" });
  if (result.product) return result.product;
  return {
    slug: "previa",
    name: draft.name || "Nome do produto",
    summary: draft.summary,
    description: draft.description,
    category: draft.category,
    headline: { value: draft.headlineValue || draft.name || "?", label: draft.headlineLabel },
    specs: draft.specs.filter((s) => s.label && s.value),
    includes: [],
    variants: [],
    delivery: draft.delivery,
    tone: draft.tone,
    tag: draft.tag || undefined,
    image: draft.image || undefined,
  };
}
