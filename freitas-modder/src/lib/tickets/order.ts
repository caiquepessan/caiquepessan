/**
 * Monta o ticket a partir do que a pessoa escolheu (carrinho, um produto
 * ou assunto livre). Os preços saem sempre do catálogo, nunca do navegador.
 */
import type { TicketItem } from "@/db/schema";
import { findVariant, platforms, priceOnRequest, type Platform, type Product } from "@/data/products";
import { LIMITS, type TicketKind } from "./status";

export type OrderSource = "carrinho" | "produto" | "outro";

/** O que o formulário manda (campo "pedido", em JSON). */
export interface OrderInput {
  source: OrderSource;
  items: { slug: string; platform: Platform; qty: number }[];
  subject?: string;
  psnId?: string;
  message?: string;
}

export interface ParsedOrder {
  kind: TicketKind;
  subject: string;
  platform: Platform | null;
  psnId: string | null;
  items: TicketItem[];
  total: number | null;
  message: string;
  fromCart: boolean;
}

const isPlatform = (v: unknown): v is Platform => v === "ps4" || v === "ps5";

function cleanText(value: unknown, max: number) {
  return typeof value === "string" ? value.replace(/\r\n/g, "\n").trim().slice(0, max) : "";
}

export function parseOrder(raw: unknown, catalog: Product[]): ParsedOrder | { error: string } {
  if (!raw || typeof raw !== "object") return { error: "Pedido inválido. Recarregue a página." };
  const input = raw as Partial<OrderInput>;
  const source: OrderSource =
    input.source === "carrinho" || input.source === "produto" ? input.source : "outro";
  const message = cleanText(input.message, LIMITS.message);
  const psnId = cleanText(input.psnId, LIMITS.psnId).replace(/\s+/g, "") || null;

  if (source === "outro") {
    const subject = cleanText(input.subject, LIMITS.subject);
    if (subject.length < 3) return { error: "Escreva o assunto do ticket." };
    if (message.length < 5) return { error: "Conte um pouco do que você precisa." };
    return { kind: "outro", subject, platform: null, psnId, items: [], total: null, message, fromCart: false };
  }

  const list = Array.isArray(input.items) ? input.items.slice(0, 20) : [];
  if (list.length === 0) return { error: "Escolha pelo menos um produto." };

  const items: TicketItem[] = [];
  const products: Product[] = [];
  for (const entry of list) {
    const product = catalog.find((p) => p.slug === entry?.slug);
    if (!product || !isPlatform(entry.platform)) {
      return { error: "Um dos produtos não está mais na loja. Confira e tente de novo." };
    }
    const qty = Math.max(1, Math.min(10, Math.floor(Number(entry.qty) || 1)));
    const variant = findVariant(product, entry.platform);
    if (!variant && !priceOnRequest(product)) {
      return { error: `${product.name} não está disponível para ${platforms[entry.platform].label}.` };
    }
    const existing = items.find((i) => i.slug === product.slug && i.platform === entry.platform);
    if (existing) {
      existing.qty = Math.min(10, existing.qty + qty);
      continue;
    }
    items.push({
      slug: product.slug,
      name: product.name,
      platform: entry.platform,
      qty,
      unitPrice: variant ? Math.round(variant.price * 100) : null,
    });
    products.push(product);
  }

  const priced = items.every((i) => i.unitPrice !== null);
  const total = priced ? items.reduce((sum, i) => sum + (i.unitPrice ?? 0) * i.qty, 0) : null;
  const kind: TicketKind = products.every((p) => p.category === "conta") ? "conta" : "servico";
  const consoles = new Set(items.map((i) => i.platform));
  const platform = consoles.size === 1 ? items[0].platform : null;

  const names = items.map((i) => `${i.qty > 1 ? `${i.qty}x ` : ""}${i.name}`).join(" + ");
  const subject = `${names}${platform ? ` · ${platforms[platform].label}` : ""}`.slice(0, LIMITS.subject);

  return { kind, subject, platform, psnId, items, total, message, fromCart: source === "carrinho" };
}
