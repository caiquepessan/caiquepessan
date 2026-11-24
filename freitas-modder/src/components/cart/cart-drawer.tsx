"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Minus, Plus, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { ProductSwatch } from "@/components/product/product-panel";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { loginEnabled } from "@/lib/auth-client";
import { lockScroll, unlockScroll } from "@/lib/lenis";
import { formatBRL } from "@/lib/utils";
import { buildOrderMessage, whatsappLink } from "@/lib/whatsapp";
import { useCatalog } from "@/components/catalog-provider";
import { cartTotals, resolveCartItems, useCart } from "@/store/cart";

export function CartDrawer() {
  const items = useCart((s) => s.items);
  const isOpen = useCart((s) => s.isOpen);
  const close = useCart((s) => s.close);
  const setQty = useCart((s) => s.setQty);
  const clear = useCart((s) => s.clear);
  const closeRef = useRef<HTMLButtonElement>(null);

  const catalog = useCatalog();
  const resolved = useMemo(() => resolveCartItems(items, catalog), [items, catalog]);
  const { count, total } = cartTotals(resolved);

  const checkoutHref = useMemo(
    () =>
      whatsappLink(
        buildOrderMessage(
          resolved.map((i) => ({
            name: i.product.name,
            platformLabel: i.platformLabel,
            qty: i.qty,
            unitPrice: i.unitPrice,
          })),
        ),
      ),
    [resolved],
  );

  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    toast.dismiss();
    lockScroll();
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      unlockScroll();
      window.removeEventListener("keydown", onKey);
      previouslyFocused?.focus?.();
    };
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
            className="fixed inset-0 z-[80] bg-black/70"
            aria-hidden
          />
          <motion.aside
            key="cart-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Carrinho"
            data-lenis-prevent
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 34, stiffness: 340 }}
            className="fixed inset-y-0 right-0 z-[90] flex w-full max-w-[420px] flex-col bg-ink-900 sm:inset-y-2 sm:right-2 sm:rounded-3xl sm:border sm:border-white/[0.08]"
          >
            <header className="flex items-center justify-between px-6 pb-4 pt-6">
              <h2 className="font-display text-3xl font-extrabold uppercase">
                Carrinho <span className="text-stone-500">{count}</span>
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Fechar carrinho"
                className="grid size-10 place-items-center rounded-full bg-white/[0.06] text-stone-300 transition-colors hover:bg-white/[0.12] hover:text-white"
              >
                <X className="size-[18px]" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6">
              {resolved.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center pb-16 text-center">
                  <ShoppingBag className="size-10 text-stone-600" strokeWidth={1.5} />
                  <p className="mt-4 text-lg font-semibold">Seu carrinho está vazio</p>
                  <p className="mt-1 max-w-60 text-[15px] text-stone-400">
                    Escolha um pacote pra começar.
                  </p>
                  <Link
                    href="/loja"
                    onClick={close}
                    className="mt-5 text-[15px] font-semibold text-brand-400 hover:text-brand-300"
                  >
                    Ver preços
                  </Link>
                </div>
              ) : (
                <ul className="flex flex-col">
                  <AnimatePresence initial={false}>
                    {resolved.map((item) => (
                      <motion.li
                        key={`${item.slug}-${item.platform}`}
                        layout
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40, transition: { duration: 0.2 } }}
                        className="flex gap-4 border-b border-white/[0.07] py-4 last:border-b-0"
                      >
                        <ProductSwatch product={item.product} className="size-[72px]" />
                        <div className="flex min-w-0 flex-1 flex-col justify-between">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <Link
                                href={`/loja/${item.slug}`}
                                onClick={close}
                                className="block truncate font-semibold hover:text-brand-400"
                              >
                                {item.product.name}
                              </Link>
                              <p className="text-sm text-stone-500">{item.platformLabel}</p>
                            </div>
                            <p className="font-semibold tabular-nums">
                              {formatBRL(item.unitPrice * item.qty)}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setQty(item.slug, item.platform, item.qty - 1)}
                              aria-label={item.qty === 1 ? "Remover do carrinho" : "Diminuir quantidade"}
                              className="grid size-8 place-items-center rounded-lg bg-white/[0.06] text-stone-300 hover:bg-white/[0.12] hover:text-white"
                            >
                              <Minus className="size-3.5" />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold tabular-nums">{item.qty}</span>
                            <button
                              type="button"
                              onClick={() => setQty(item.slug, item.platform, item.qty + 1)}
                              aria-label="Aumentar quantidade"
                              className="grid size-8 place-items-center rounded-lg bg-white/[0.06] text-stone-300 hover:bg-white/[0.12] hover:text-white"
                            >
                              <Plus className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {resolved.length > 0 && (
              <footer className="border-t border-white/[0.07] px-6 pb-6 pt-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-stone-400">Total</span>
                  <span className="font-display text-4xl font-extrabold tabular-nums">
                    {formatBRL(total)}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-stone-500">
                  O pedido vira um ticket: o Freitas combina o Pix e faz tudo direto na sua
                  conta. Garantia de {siteConfig.business.warrantyDays} dias.
                </p>
                {loginEnabled ? (
                  <>
                    <ButtonLink href="/tickets/novo?de=carrinho" onClick={close} size="lg" className="mt-5 w-full">
                      Fazer pedido
                      <ArrowRight className="size-5" />
                    </ButtonLink>
                    <a
                      href={checkoutHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-stone-400 hover:text-white"
                    >
                      <WhatsAppIcon size={16} />
                      Prefiro finalizar no WhatsApp
                    </a>
                  </>
                ) : (
                  <ButtonAnchor
                    href={checkoutHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="lg"
                    className="mt-5 w-full"
                  >
                    <WhatsAppIcon size={20} />
                    Finalizar no WhatsApp
                  </ButtonAnchor>
                )}
                <div className="mt-3 flex items-center justify-between text-sm">
                  <button type="button" onClick={close} className="font-medium text-stone-400 hover:text-white">
                    Continuar comprando
                  </button>
                  <button type="button" onClick={clear} className="font-medium text-stone-500 hover:text-brand-400">
                    Esvaziar
                  </button>
                </div>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
