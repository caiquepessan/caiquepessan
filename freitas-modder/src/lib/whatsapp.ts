import { siteConfig } from "@/config/site";
import { formatBRL } from "@/lib/utils";

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${siteConfig.contact.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export interface OrderLine {
  name: string;
  platformLabel: string;
  qty: number;
  unitPrice: number;
}

export function buildOrderMessage(lines: OrderLine[]) {
  const total = lines.reduce((sum, l) => sum + l.unitPrice * l.qty, 0);
  const items = lines
    .map(
      (l) =>
        `• ${l.qty}x *${l.name}* (${l.platformLabel}): ${formatBRL(l.unitPrice * l.qty)}`,
    )
    .join("\n");

  return [
    "Oi! Quero fazer este pedido:",
    "",
    items,
    "",
    `*Total: ${formatBRL(total)}*`,
    "",
    "Como faço pra pagar?",
  ].join("\n");
}

export function buildProductMessage(name: string, platformLabel: string, price: number) {
  return buildOrderMessage([{ name, platformLabel, qty: 1, unitPrice: price }]);
}

/** Produto sem preço fixo: pergunta o preço e se ainda está disponível. */
export function buildQuoteMessage(name: string, platformLabel: string) {
  return `Oi! Vi a ${name} no site. Ainda está disponível? Qual o preço? Meu console é ${platformLabel}.`;
}

export const defaultWhatsappMessage = "Oi! Vim pelo site e queria tirar uma dúvida.";
