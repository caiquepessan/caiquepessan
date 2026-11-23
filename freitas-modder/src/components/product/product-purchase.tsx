"use client";

import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { ButtonAnchor } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import {
  findVariant,
  platforms,
  priceOnRequest,
  samePriceEverywhere,
  type Product,
} from "@/data/products";
import { formatBRL } from "@/lib/utils";
import { buildProductMessage, whatsappLink } from "@/lib/whatsapp";
import { useConsole } from "@/store/console";
import { AddButton } from "./add-button";
import { AnimatedPrice } from "./animated-price";
import { ConsoleSwitch } from "./console-switch";
import { QuoteButton } from "./quote-button";

/** Bloco de compra da página do produto. */
export function ProductPurchase({ product }: { product: Product }) {
  const platform = useConsole((s) => s.platform);
  const variant = findVariant(product, platform);
  const label = platforms[platform].label;

  if (priceOnRequest(product)) {
    return (
      <div className="rounded-3xl border border-white/[0.08] bg-ink-850 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[15px] text-stone-400">Seu console</p>
          <ConsoleSwitch />
        </div>
        <div className="mt-6 border-t border-white/[0.07] pt-6">
          <p className="font-display text-5xl font-extrabold uppercase leading-none">
            Preço no WhatsApp
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-stone-400">
            É unidade única, então o preço é combinado na conversa. Chama pra saber se
            ainda está disponível.
          </p>
        </div>
        <QuoteButton product={product} className="mt-6 h-12 w-full" />
        <p className="mt-5 text-sm text-stone-500">
          Entrega: {product.delivery.toLowerCase()} · Garantia de{" "}
          {siteConfig.business.warrantyDays} dias
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/[0.08] bg-ink-850 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[15px] text-stone-400">Seu console</p>
        <ConsoleSwitch />
      </div>

      <div className="mt-6 border-t border-white/[0.07] pt-6">
        {variant ? (
          <>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <AnimatedPrice
                value={variant.price}
                className="font-display text-6xl font-extrabold leading-none"
              />
              {variant.oldPrice && (
                <span className="text-stone-500 line-through">{formatBRL(variant.oldPrice)}</span>
              )}
            </div>
            <p className="mt-2 text-[15px] text-stone-400">
              {samePriceEverywhere(product)
                ? "No Pix, o mesmo preço no PS4 e no PS5."
                : `No Pix, versão de ${label}.`}{" "}
              Também aceitamos cartão.
            </p>
          </>
        ) : (
          <p className="text-lg font-medium text-stone-300">
            Esse produto ainda não está disponível para {label}.
          </p>
        )}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <AddButton product={product} label="Adicionar ao carrinho" className="h-12 w-full" />
        <ButtonAnchor
          href={whatsappLink(
            variant
              ? buildProductMessage(product.name, label, variant.price)
              : `Oi! Vocês têm ${product.name} pra ${label}?`,
          )}
          target="_blank"
          rel="noopener noreferrer"
          variant="secondary"
          className="w-full"
        >
          <WhatsAppIcon size={18} />
          Comprar pelo WhatsApp
        </ButtonAnchor>
      </div>

      <p className="mt-5 text-sm text-stone-500">
        Entrega: {product.delivery.toLowerCase()} · Garantia de {siteConfig.business.warrantyDays} dias
      </p>
    </div>
  );
}
