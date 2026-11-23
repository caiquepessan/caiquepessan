"use client";

import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { platforms, type Product } from "@/data/products";
import { cn } from "@/lib/utils";
import { buildQuoteMessage, whatsappLink } from "@/lib/whatsapp";
import { useConsole } from "@/store/console";

/**
 * Para produto sem preço fixo (ex.: conta única): no lugar do carrinho,
 * abre o WhatsApp perguntando o preço.
 */
export function QuoteButton({
  product,
  className,
  label = "Perguntar o preço",
  compact = false,
}: {
  product: Product;
  className?: string;
  label?: string;
  /** Só o ícone (cards estreitos). */
  compact?: boolean;
}) {
  const platform = useConsole((s) => s.platform);

  return (
    <a
      href={whatsappLink(buildQuoteMessage(product.name, platforms[platform].label))}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="link"
      aria-label={compact ? `Perguntar o preço de ${product.name} no WhatsApp` : undefined}
      className={cn(
        "relative z-10 inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#25D366] text-[15px] font-semibold text-ink-950 transition-[filter,transform] duration-200 hover:brightness-110 active:scale-[0.97]",
        compact ? "w-11" : "px-4",
        className,
      )}
    >
      <WhatsAppIcon size={compact ? 20 : 18} />
      {!compact && label}
    </a>
  );
}
