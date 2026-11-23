"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { Scramble } from "@/components/effects/scramble";
import { EASE } from "@/components/effects/reveal";
import { ConsoleSwitch } from "@/components/product/console-switch";
import { ButtonAnchor } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { siteConfig } from "@/config/site";
import { getLenis, lockScroll, scrollToTarget, unlockScroll } from "@/lib/lenis";
import { cn } from "@/lib/utils";
import { defaultWhatsappMessage, whatsappLink } from "@/lib/whatsapp";
import { useCatalog } from "@/components/catalog-provider";
import { cartTotals, resolveCartItems, useCart } from "@/store/cart";

const links = [
  { href: "/loja", label: "Preços" },
  { href: "/#dinheiro", label: "Dinheiro" },
  { href: "/#servicos", label: "Level" },
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/#duvidas", label: "Dúvidas" },
];

/** Links "/#secao" na própria home rolam suavemente em vez de navegar. */
function handleHashLink(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  if (!href.startsWith("/#") || window.location.pathname !== "/") return;
  if (scrollToTarget(href.slice(1))) e.preventDefault();
}

function handleLogoClick(e: React.MouseEvent<HTMLAnchorElement>) {
  if (window.location.pathname !== "/") return;
  e.preventDefault();
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(0, { duration: 1 });
  else window.scrollTo({ top: 0, behavior: "smooth" });
}

function CartButton() {
  const items = useCart((s) => s.items);
  const bump = useCart((s) => s.bump);
  const open = useCart((s) => s.open);
  const catalog = useCatalog();
  const { count } = cartTotals(resolveCartItems(items, catalog));

  return (
    <button
      type="button"
      onClick={open}
      aria-label={`Abrir carrinho (${count} ${count === 1 ? "item" : "itens"})`}
      data-cart-target
      className="relative grid size-10 place-items-center rounded-full bg-white/[0.06] text-white ring-1 ring-inset ring-white/10 transition-colors hover:bg-white/[0.12]"
    >
      <motion.span
        key={bump}
        initial={false}
        animate={bump ? { scale: [1, 1.4, 0.9, 1], rotate: [0, -12, 8, 0] } : undefined}
        transition={{ duration: 0.5 }}
        className="grid place-items-center"
      >
        <ShoppingBag className="size-[18px]" strokeWidth={2} />
      </motion.span>
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
            className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand-500 px-1 text-[11px] font-bold tabular-nums text-white"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 12));

  useEffect(() => {
    if (!menuOpen) return;
    lockScroll();
    document.documentElement.dataset.menuOpen = "true";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      unlockScroll();
      delete document.documentElement.dataset.menuOpen;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300",
          scrolled || menuOpen
            ? "border-white/[0.07] bg-ink-950/85 backdrop-blur-lg"
            : "border-transparent bg-transparent",
        )}
      >
        <motion.div
          aria-hidden
          style={{ scaleX: scrollYProgress }}
          className={cn(
            "absolute inset-x-0 -bottom-px h-0.5 origin-left bg-brand-500 transition-opacity duration-300",
            scrolled ? "opacity-100" : "opacity-0",
          )}
        />
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-6 px-5">
          <Link href="/" onClick={handleLogoClick} aria-label={`${siteConfig.name}, início`}>
            <Logo className="h-6 sm:h-7" />
          </Link>

          <nav aria-label="Principal" className="hidden items-center gap-7 lg:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleHashLink(e, link.href)}
                className="group relative py-1 text-[15px] font-medium text-stone-300 transition-colors hover:text-white"
              >
                <Scramble text={link.label} />
                <span
                  aria-hidden
                  className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-brand-500 transition-transform duration-300 ease-out group-hover:scale-x-100"
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <ConsoleSwitch size="sm" className="hidden sm:inline-flex" />
            <CartButton />
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuOpen}
              className="grid size-10 place-items-center rounded-full bg-white/[0.06] ring-1 ring-inset ring-white/10 transition-colors hover:bg-white/[0.12] lg:hidden"
            >
              {menuOpen ? <X className="size-[18px]" /> : <Menu className="size-[18px]" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-ink-950 px-5 pb-10 pt-24 lg:hidden"
            data-lenis-prevent
          >
            <nav aria-label="Menu" className="flex flex-col">
              {[{ href: "/", label: "Início" }, ...links].map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.04, duration: 0.45, ease: EASE }}
                >
                  <Link
                    href={link.href}
                    onClick={(e) => {
                      setMenuOpen(false);
                      handleHashLink(e, link.href);
                    }}
                    className="block border-b border-white/[0.07] py-4 font-display text-4xl font-extrabold uppercase transition-colors hover:text-brand-500"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.45, ease: EASE }}
              className="mt-8 flex flex-col gap-6"
            >
              <div className="flex items-center justify-between">
                <span className="text-stone-400">Seu console</span>
                <ConsoleSwitch />
              </div>
              <ButtonAnchor
                href={whatsappLink(defaultWhatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
              >
                <WhatsAppIcon size={20} /> Chamar no WhatsApp
              </ButtonAnchor>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
