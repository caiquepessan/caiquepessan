"use client";

import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, ShieldCheck, ShoppingBag, Trash2, X, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { EASE_OUT_EXPO } from "@/components/effects/reveal";
import { ProductThumb } from "@/components/product/product-thumb";
import { ButtonAnchor } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { lockScroll, unlockScroll } from "@/lib/lenis";
import { formatBRL } from "@/lib/utils";
import { buildOrderMessage, whatsappLink } from "@/lib/whatsapp";
import { cartTotals, resolveCartItems, useCart } from "@/store/cart";

export function CartDrawer() {
  const items = useCart((s) => s.items);
  const isOpen = useCart((s) => s.isOpen);
  const close = useCart((s) => s.close);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const closeRef = useRef<HTMLButtonElement>(null);

  const resolved = useMemo(() => resolveCartItems(items), [items]);
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
            transition={{ duration: 0.3 }}
            onClick={close}
            className="fixed inset-0 z-[80] bg-black/65 backdrop-blur-sm"
            aria-hidden
          />
          <motion.aside
            key="cart-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Carrinho de compras"
            data-lenis-prevent
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="fixed inset-y-0 right-0 z-[90] flex w-full max-w-[440px] flex-col border-l border-blood-500/20 bg-ink-900/95 shadow-[-30px_0_80px_-20px_rgba(255,42,71,0.25)] backdrop-blur-2xl"
          >
            <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,#000,transparent_40%)]" />

            <header className="relative flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
              <div>
                <p className="font-tech text-[11px] font-semibold uppercase tracking-[0.3em] text-blood-500">
                  Seu pedido
                </p>
                <h2 className="font-display text-3xl uppercase tracking-wide">
                  Carrinho{" "}
                  <span className="text-bone-500">({count})</span>
                </h2>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Fechar carrinho"
                className="grid size-10 place-items-center rounded-lg border border-white/10 text-bone-300 transition-colors hover:border-blood-500/60 hover:text-white"
              >
                <X className="size-5" />
              </button>
            </header>

            <div className="relative flex-1 overflow-y-auto px-6 py-5">
              {resolved.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.6, ease: EASE_OUT_EXPO }}
                  className="flex h-full flex-col items-center justify-center text-center"
                >
                  <div className="relative mb-6 grid size-24 place-items-center">
                    <span className="absolute inset-0 animate-pulse-ring rounded-full border border-blood-500/40" />
                    <span className="absolute inset-3 rounded-full bg-blood-500/10" />
                    <ShoppingBag className="relative size-9 text-blood-500" strokeWidth={1.5} />
                  </div>
                  <p className="font-display text-2xl uppercase tracking-wide">
                    Carrinho vazio
                  </p>
                  <p className="mt-2 max-w-64 text-sm text-bone-400">
                    Escolha uma conta ou serviço e ele aparece aqui.
                  </p>
                  <Link
                    href="/contas"
                    onClick={close}
                    className="mt-6 font-tech text-sm font-semibold uppercase tracking-[0.15em] text-blood-400 underline-offset-4 hover:text-blood-300 hover:underline"
                  >
                    Ver catálogo →
                  </Link>
                </motion.div>
              ) : (
                <ul className="flex flex-col gap-3">
                  <AnimatePresence initial={false}>
                    {resolved.map((item, index) => (
                      <motion.li
                        key={`${item.slug}-${item.platform}`}
                        layout
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0, transition: { delay: index * 0.04 } }}
                        exit={{ opacity: 0, x: 60, transition: { duration: 0.25 } }}
                        className="flex gap-4 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3"
                      >
                        <ProductThumb product={item.product} className="size-20 shrink-0" />
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <Link
                                href={`/contas/${item.slug}`}
                                onClick={close}
                                className="block truncate font-tech font-semibold text-bone-50 hover:text-blood-400"
                              >
                                {item.product.name}
                              </Link>
                              <p className="text-xs text-bone-500">{item.platformLabel}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => remove(item.slug, item.platform)}
                              aria-label={`Remover ${item.product.name}`}
                              className="grid size-8 shrink-0 place-items-center rounded-md text-bone-500 transition-colors hover:bg-blood-500/10 hover:text-blood-400"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="flex items-center rounded-lg border border-white/10">
                              <button
                                type="button"
                                onClick={() => setQty(item.slug, item.platform, item.qty - 1)}
                                aria-label="Diminuir quantidade"
                                className="grid size-8 place-items-center text-bone-300 hover:text-white"
                              >
                                <Minus className="size-3.5" />
                              </button>
                              <span className="w-7 text-center font-tech text-sm font-semibold tabular-nums">
                                {item.qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => setQty(item.slug, item.platform, item.qty + 1)}
                                aria-label="Aumentar quantidade"
                                className="grid size-8 place-items-center text-bone-300 hover:text-white"
                              >
                                <Plus className="size-3.5" />
                              </button>
                            </div>
                            <motion.span
                              key={item.qty}
                              initial={{ y: -6, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              className="font-tech font-bold tabular-nums text-bone-50"
                            >
                              {formatBRL(item.unitPrice * item.qty)}
                            </motion.span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {resolved.length > 0 && (
              <footer className="relative border-t border-white/[0.07] bg-ink-950/60 px-6 pb-6 pt-5">
                <div className="mb-4 grid grid-cols-2 gap-2 text-[11px] text-bone-400">
                  <span className="flex items-center gap-1.5">
                    <Zap className="size-3.5 text-blood-500" /> Entrega imediata
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5 text-blood-500" /> Garantia de{" "}
                    {siteConfig.business.warrantyDays} dias
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-sm text-bone-400">Total</span>
                  <motion.span
                    key={total}
                    initial={{ scale: 1.15, color: "#ff5f73" }}
                    animate={{ scale: 1, color: "#fbf6f7" }}
                    transition={{ duration: 0.4 }}
                    className="origin-right font-display text-4xl tabular-nums tracking-wide"
                  >
                    {formatBRL(total)}
                  </motion.span>
                </div>
                <p className="mb-4 mt-1 text-right text-xs text-bone-500">
                  Pagamento via PIX ou cartão, combinado no WhatsApp
                </p>
                <ButtonAnchor
                  href={checkoutHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="lg"
                  className="w-full"
                >
                  <WhatsAppIcon size={20} />
                  Finalizar pelo WhatsApp
                </ButtonAnchor>
                <div className="mt-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={close}
                    className="font-tech text-xs font-semibold uppercase tracking-[0.15em] text-bone-400 hover:text-white"
                  >
                    ← Continuar comprando
                  </button>
                  <button
                    type="button"
                    onClick={clear}
                    className="font-tech text-xs font-semibold uppercase tracking-[0.15em] text-bone-600 hover:text-blood-400"
                  >
                    Limpar
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
