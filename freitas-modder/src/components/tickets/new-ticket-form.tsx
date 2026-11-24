"use client";

import { ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useActionState, useMemo, useState, useSyncExternalStore } from "react";
import { openTicket, type FormState } from "@/app/tickets/actions";
import { useCatalog } from "@/components/catalog-provider";
import { platformOrder, platforms, type Category, type Platform } from "@/data/products";
import type { OrderInput } from "@/lib/tickets/order";
import { LIMITS } from "@/lib/tickets/status";
import { cn, formatBRL } from "@/lib/utils";
import { cartTotals, resolveCartItems, useCart } from "@/store/cart";

export interface FormProduct {
  slug: string;
  name: string;
  category: Category;
  /** Preço em reais por console; vazio = a combinar. */
  prices: Partial<Record<Platform, number>>;
}

const field =
  "block w-full rounded-xl border border-white/10 bg-ink-950 px-4 text-[16px] text-white outline-none transition-colors placeholder:text-stone-600 focus:border-brand-500";

function useCartReady() {
  return useSyncExternalStore(
    (callback) => useCart.persist.onFinishHydration(callback),
    () => useCart.persist.hasHydrated(),
    () => false,
  );
}

/** Formulário de abrir ticket: pedido do carrinho, de um produto ou assunto livre. */
export function NewTicketForm({
  mode,
  product,
  initialPlatform = "ps5",
}: {
  mode: "carrinho" | "produto" | "outro";
  product?: FormProduct;
  initialPlatform?: Platform;
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(openTicket, {});
  const [platform, setPlatform] = useState<Platform>(initialPlatform);
  const [psnId, setPsnId] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const cartReady = useCartReady();
  const cartItems = useCart((s) => s.items);
  const catalog = useCatalog();
  const resolved = useMemo(() => resolveCartItems(cartItems, catalog), [cartItems, catalog]);
  const { total: cartTotal } = cartTotals(resolved);

  const productPrice = product?.prices[platform];
  const onRequest = product ? Object.keys(product.prices).length === 0 : false;
  const unavailable = mode === "produto" && !onRequest && productPrice === undefined;
  const emptyCart = mode === "carrinho" && cartReady && resolved.length === 0;

  const payload: OrderInput =
    mode === "carrinho"
      ? { source: "carrinho", items: resolved.map((i) => ({ slug: i.slug, platform: i.platform, qty: i.qty })), psnId, message }
      : mode === "produto" && product
        ? { source: "produto", items: [{ slug: product.slug, platform, qty: 1 }], psnId, message }
        : { source: "outro", items: [], subject, psnId, message };

  const disabled =
    pending || unavailable || emptyCart || (mode === "carrinho" && !cartReady) || (mode === "outro" && subject.trim().length < 3);

  return (
    <form action={formAction} className="grid gap-5">
      <input type="hidden" name="pedido" value={JSON.stringify(payload)} />

      {mode === "carrinho" && (
        <section className="rounded-3xl border border-white/[0.08] bg-ink-900 p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Seu pedido</h2>
          {!cartReady ? (
            <div className="mt-4 h-20 animate-pulse rounded-2xl bg-white/[0.04]" />
          ) : emptyCart ? (
            <div className="mt-4 flex flex-col items-start gap-3 text-stone-400">
              <p className="flex items-center gap-2">
                <ShoppingBag className="size-5" /> Seu carrinho está vazio.
              </p>
              <Link href="/loja" className="font-semibold text-brand-400 hover:text-brand-300">
                Ver preços
              </Link>
            </div>
          ) : (
            <>
              <ul className="mt-4 grid gap-2.5">
                {resolved.map((item) => (
                  <li key={`${item.slug}-${item.platform}`} className="flex items-baseline justify-between gap-4">
                    <span>
                      <span className="font-semibold">
                        {item.qty > 1 && <span className="text-stone-400">{item.qty}x </span>}
                        {item.product.name}
                      </span>{" "}
                      <span className="text-sm text-stone-500">· {item.platformLabel}</span>
                    </span>
                    <span className="tabular-nums text-stone-300">{formatBRL(item.unitPrice * item.qty)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-baseline justify-between border-t border-white/[0.07] pt-4">
                <span className="text-stone-400">Total no Pix</span>
                <span className="font-display text-3xl font-extrabold tabular-nums">{formatBRL(cartTotal)}</span>
              </div>
            </>
          )}
        </section>
      )}

      {mode === "produto" && product && (
        <section className="rounded-3xl border border-white/[0.08] bg-ink-900 p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="mt-1 font-display text-3xl font-extrabold tabular-nums">
                {onRequest ? "Preço a combinar" : productPrice !== undefined ? formatBRL(productPrice) : "Indisponível"}
              </p>
            </div>
            <div role="radiogroup" aria-label="Seu console" className="inline-flex rounded-full bg-white/[0.06] p-1 ring-1 ring-inset ring-white/10">
              {platformOrder.map((p) => (
                <button
                  key={p}
                  type="button"
                  role="radio"
                  aria-checked={platform === p}
                  onClick={() => setPlatform(p)}
                  className={cn(
                    "h-10 rounded-full px-5 text-sm font-semibold transition-colors",
                    platform === p ? "bg-brand-500 text-white" : "text-stone-400 hover:text-white",
                  )}
                >
                  {platforms[p].label}
                </button>
              ))}
            </div>
          </div>
          {unavailable && (
            <p className="mt-3 text-[15px] text-brand-300">
              Esse produto não está disponível para {platforms[platform].label}.
            </p>
          )}
        </section>
      )}

      {mode === "outro" && (
        <label className="block">
          <span className="text-[15px] font-semibold text-stone-200">Assunto</span>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            maxLength={LIMITS.subject}
            placeholder="Ex.: Quero um pacote diferente"
            className={cn(field, "mt-2 h-12")}
          />
        </label>
      )}

      <label className="block">
        <span className="text-[15px] font-semibold text-stone-200">Seu ID na PSN (opcional)</span>
        <span className="mt-0.5 block text-sm text-stone-500">Ajuda o Freitas a achar a conta certa.</span>
        <input
          value={psnId}
          onChange={(e) => setPsnId(e.target.value)}
          maxLength={LIMITS.psnId}
          autoComplete="off"
          spellCheck={false}
          placeholder="Ex.: freitas_modder"
          className={cn(field, "mt-2 h-12")}
        />
      </label>

      <label className="block">
        <span className="text-[15px] font-semibold text-stone-200">
          Mensagem{mode === "outro" ? "" : " (opcional)"}
        </span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={LIMITS.message}
          rows={4}
          placeholder={
            mode === "outro"
              ? "Conte o que você precisa."
              : "Quer avisar algo? Ex.: melhor horário pra liberar o acesso."
          }
          className={cn(field, "mt-2 min-h-28 resize-y py-3 leading-relaxed")}
        />
      </label>

      {state.error && (
        <p role="alert" className="rounded-2xl bg-brand-500/10 px-4 py-3 text-[15px] text-brand-200 ring-1 ring-inset ring-brand-500/30">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={disabled}
        className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-brand-500 px-7 text-base font-semibold text-white transition-colors hover:bg-brand-400 disabled:opacity-50"
      >
        {pending ? "Abrindo o ticket..." : "Abrir ticket"}
        <ArrowRight className="size-5" />
      </button>
      <p className="-mt-2 text-sm text-stone-500">
        O Freitas recebe um aviso e responde no ticket. Nada é cobrado agora.
      </p>
    </form>
  );
}
