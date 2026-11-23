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
    `Olá, ${siteConfig.name}! Quero fazer um pedido:`,
    "",
    items,
    "",
    `*Total: ${formatBRL(total)}*`,
    "",
    "Como faço o pagamento?",
  ].join("\n");
}

export function buildProductMessage(name: string, platformLabel: string, price: number) {
  return buildOrderMessage([{ name, platformLabel, qty: 1, unitPrice: price }]);
}

export const defaultWhatsappMessage = `Olá, ${siteConfig.name}! Vim pelo site e queria tirar uma dúvida.`;
