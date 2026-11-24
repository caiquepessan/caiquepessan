"use client";

import { ArrowRight, QrCode, KeyRound } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import {
  findVariant,
  platforms,
  priceOnRequest,
  samePriceEverywhere,
  type Product,
} from "@/data/products";
import { loginEnabled } from "@/lib/auth-client";
import { formatBRL } from "@/lib/utils";
import { buildProductMessage, buildQuoteMessage, whatsappLink } from "@/lib/whatsapp";
import { useConsole } from "@/store/console";
import { AddButton } from "./add-button";
import { AnimatedPrice } from "./animated-price";
import { ConsoleSwitch } from "./console-switch";
import { QuoteButton } from "./quote-button";

/** Como o pedido é entregue: quase tudo é feito pelo Freitas dentro da conta. */
function HowDelivered({ product }: { product: Product }) {
  const account = product.category === "conta";
  const Icon = account ? KeyRound : QrCode;
  return (
    <p className="mt-5 flex gap-2.5 rounded-2xl bg-white/[0.03] px-3.5 py-3 text-sm leading-relaxed text-stone-300 ring-1 ring-inset ring-white/[0.07]">
      <Icon className="mt-0.5 size-4 shrink-0 text-brand-400" />
      {account
        ? "Você recebe o e-mail e a senha da conta pelo ticket, depois do pagamento."
        : "Feito pelo Freitas direto na sua conta: você libera o acesso por QR Code no app da PlayStation, sem passar senha."}
    </p>
  );
}

function orderHref(product: Product, platform: string) {
  return `/tickets/novo?produto=${encodeURIComponent(product.slug)}&console=${platform}`;
}

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
            Preço a combinar
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-stone-400">
            É unidade única, então o preço é combinado na conversa. Pergunte para saber
            se ainda está disponível.
          </p>
        </div>
        {loginEnabled ? (
          <>
            <ButtonLink href={orderHref(product, platform)} className="mt-6 w-full">
              Perguntar o preço
              <ArrowRight className="size-4" />
            </ButtonLink>
            <a
              href={whatsappLink(buildQuoteMessage(product.name, label))}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-stone-400 hover:text-white"
            >
              <WhatsAppIcon size={16} /> Ou pergunte no WhatsApp
            </a>
          </>
        ) : (
          <QuoteButton product={product} className="mt-6 h-12 w-full" />
        )}
        <HowDelivered product={product} />
        <p className="mt-4 text-sm text-stone-500">
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
        {loginEnabled && variant ? (
          <ButtonLink href={orderHref(product, platform)} variant="secondary" className="w-full">
            Pedir agora
            <ArrowRight className="size-4" />
          </ButtonLink>
        ) : (
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
        )}
      </div>
      {loginEnabled && variant && (
        <a
          href={whatsappLink(buildProductMessage(product.name, label, variant.price))}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-stone-400 hover:text-white"
        >
          <WhatsAppIcon size={16} /> Prefere comprar pelo WhatsApp?
        </a>
      )}

      <HowDelivered product={product} />

      <p className="mt-4 text-sm text-stone-500">
        Entrega: {product.delivery.toLowerCase()} · Garantia de {siteConfig.business.warrantyDays} dias
      </p>
    </div>
  );
}
