"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowUpRight, Menu, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DiscordIcon, WhatsAppIcon } from "@/components/icons/brand-icons";
import { EASE_OUT_EXPO } from "@/components/effects/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { siteConfig } from "@/config/site";
import { lockScroll, scrollToTarget, unlockScroll, getLenis } from "@/lib/lenis";
import { cn } from "@/lib/utils";
import { defaultWhatsappMessage, whatsappLink } from "@/lib/whatsapp";
import { useCart } from "@/store/cart";

const links = [
  { href: "/contas", label: "Contas" },
  { href: "/#servicos", label: "Serviços" },
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/#avaliacoes", label: "Avaliações" },
  { href: "/#faq", label: "FAQ" },
];

/** Em links "/#secao" na própria home, rola suavemente em vez de navegar. */
function handleHashLink(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  if (!href.startsWith("/#") || window.location.pathname !== "/") return;
  if (scrollToTarget(href.slice(1))) e.preventDefault();
}

function handleLogoClick(e: React.MouseEvent<HTMLAnchorElement>) {
  if (window.location.pathname !== "/") return;
  e.preventDefault();
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(0, { duration: 1.2 });
  else window.scrollTo({ top: 0, behavior: "smooth" });
}

function CartButton() {
  const count = useCart((s) => s.items.reduce((sum, i) => sum + i.qty, 0));
  const bump = useCart((s) => s.bump);
  const open = useCart((s) => s.open);

  return (
    <button
      type="button"
      onClick={open}
      aria-label={`Abrir carrinho (${count} ${count === 1 ? "item" : "itens"})`}
      className="group relative grid size-11 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-bone-100 transition-colors duration-300 hover:border-blood-500/60 hover:bg-blood-500/10 hover:text-white"
    >
      <motion.span
        key={bump}
        initial={false}
        animate={bump ? { scale: [1, 1.35, 1], rotate: [0, -14, 0] } : undefined}
        transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
        className="grid place-items-center"
      >
        <ShoppingBag className="size-5" strokeWidth={1.8} />
      </motion.span>
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key="badge"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 22 }}
            className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-blood-500 px-1 font-tech text-[11px] font-bold text-white shadow-[0_0_12px_rgba(255,42,71,0.9)]"
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
  const [hovered, setHovered] = useState<string | null>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

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
      <motion.header
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: 0.1 }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 transition-all duration-500 sm:px-6",
            scrolled ? "mt-2 h-16 sm:mt-3" : "mt-0 h-[76px]",
          )}
        >
          <div
            aria-hidden
            className={cn(
              "glass pointer-events-none absolute inset-x-2 top-2 -z-10 mx-auto max-w-[calc(80rem-1rem)] rounded-2xl border border-white/[0.07] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.8)] transition-all duration-500 sm:inset-x-4 sm:top-3",
              scrolled ? "h-16 opacity-100" : "h-[76px] opacity-0",
            )}
          />

          <Link
            href="/"
            onClick={handleLogoClick}
            aria-label={`${siteConfig.name}, página inicial`}
            className="relative shrink-0"
          >
            <Logo />
          </Link>

          <nav
            aria-label="Principal"
            className="hidden items-center lg:flex"
            onMouseLeave={() => setHovered(null)}
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleHashLink(e, link.href)}
                onMouseEnter={() => setHovered(link.href)}
                className="relative px-4 py-2 font-tech text-[13px] font-semibold uppercase tracking-[0.14em] text-bone-300 transition-colors duration-200 hover:text-white"
              >
                {hovered === link.href && (
                  <motion.span
                    layoutId="nav-hover"
                    className="clip-corner absolute inset-0 -z-10 bg-blood-500/15 [--cut:8px]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            {siteConfig.contact.discord && (
              <a
                href={siteConfig.contact.discord}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Entrar no Discord"
                className="hidden size-11 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-bone-200 transition-colors duration-300 hover:border-blood-500/60 hover:bg-blood-500/10 hover:text-white sm:grid"
              >
                <DiscordIcon size={18} />
              </a>
            )}
            <CartButton />
            <ButtonLink href="/contas" size="sm" className="hidden md:inline-flex">
              Comprar agora
            </ButtonLink>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuOpen}
              className="grid size-11 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-bone-100 transition-colors hover:border-blood-500/60 lg:hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={menuOpen ? "close" : "open"}
                  initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.2 }}
                  className="grid place-items-center"
                >
                  {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ clipPath: "circle(0% at calc(100% - 44px) 40px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 44px) 40px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 44px) 40px)" }}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-ink-950 px-6 pb-10 pt-28 lg:hidden"
            data-lenis-prevent
          >
            <div aria-hidden className="grid-lines fade-mask-radial pointer-events-none absolute inset-0 opacity-60" />
            <div aria-hidden className="pointer-events-none absolute -right-32 top-20 size-96 rounded-full bg-blood-600/25 blur-[100px]" />

            <nav aria-label="Menu mobile" className="relative flex flex-col">
              {[{ href: "/", label: "Início" }, ...links].map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: 0.12 + i * 0.06, duration: 0.6, ease: EASE_OUT_EXPO }}
                >
                  <Link
                    href={link.href}
                    onClick={(e) => {
                      setMenuOpen(false);
                      handleHashLink(e, link.href);
                    }}
                    className="group flex items-center justify-between border-b border-white/[0.06] py-4 font-display text-4xl uppercase tracking-wide text-bone-100 transition-colors hover:text-blood-500"
                  >
                    <span>
                      <span className="mr-4 font-tech text-sm text-blood-500/70">
                        0{i + 1}
                      </span>
                      {link.label}
                    </span>
                    <ArrowUpRight className="size-6 text-bone-600 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-blood-500" />
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5, duration: 0.6, ease: EASE_OUT_EXPO }}
              className="relative mt-10 grid gap-3"
            >
              <a
                href={whatsappLink(defaultWhatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="clip-corner flex h-14 items-center justify-center gap-3 bg-linear-to-r from-blood-700 to-blood-500 font-tech text-sm font-semibold uppercase tracking-[0.1em] text-white"
              >
                <WhatsAppIcon size={20} /> Falar no WhatsApp
              </a>
              {siteConfig.contact.discord && (
                <a
                  href={siteConfig.contact.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="clip-corner flex h-14 items-center justify-center gap-3 border border-white/10 bg-white/[0.04] font-tech text-sm font-semibold uppercase tracking-[0.1em] text-bone-100"
                >
                  <DiscordIcon size={20} /> Entrar no Discord
                </a>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
