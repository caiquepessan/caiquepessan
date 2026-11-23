"use client";

import { motion } from "motion/react";
import { ArrowRight, BadgeCheck, CarFront, LockOpen, Building2, Zap } from "lucide-react";
import Link from "next/link";
import { AnimatedCounter } from "@/components/effects/animated-counter";
import { EASE_OUT_EXPO } from "@/components/effects/reveal";
import { Tilt } from "@/components/effects/tilt";
import { LogoMark } from "@/components/ui/logo";
import { getProduct, getStartingPrice } from "@/data/products";
import { formatBRL } from "@/lib/utils";

const showcase = getProduct("conta-lendaria");

const miniStats = [
  { icon: CarFront, value: "150+", label: "Carros" },
  { icon: LockOpen, value: "100%", label: "Unlock" },
  { icon: Building2, value: "Todas", label: "Propried." },
];

/** Card 3D da "Conta Lendária" exibido no hero. */
export function HeroShowcase() {
  const price = showcase ? getStartingPrice(showcase) : 0;

  return (
    <div className="relative mx-auto w-full max-w-[440px] animate-fade-up [animation-delay:500ms]">
      {/* Chips flutuantes */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.4, duration: 0.9, ease: EASE_OUT_EXPO }}
        className="absolute -left-14 top-16 z-30 hidden xl:block"
      >
        <div className="glass animate-float rounded-xl border border-white/10 px-4 py-3 shadow-2xl">
          <p className="font-tech text-[10px] font-semibold uppercase tracking-[0.25em] text-bone-500">
            Na conta
          </p>
          <p className="font-display text-2xl text-gold-400">+$10 BI</p>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.6, duration: 0.9, ease: EASE_OUT_EXPO }}
        className="absolute -bottom-12 -right-8 z-30 hidden xl:block"
      >
        <div className="glass animate-float-delayed flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3 shadow-2xl">
          <span className="grid size-9 place-items-center rounded-lg bg-blood-500/15 text-blood-400">
            <Zap className="size-5" />
          </span>
          <div>
            <p className="font-tech text-sm font-semibold">Entrega imediata</p>
            <p className="text-xs text-bone-500">direto no seu WhatsApp</p>
          </div>
        </div>
      </motion.div>

      {/* Brilho atrás do card */}
      <div aria-hidden className="absolute -inset-10 rounded-full bg-blood-600/30 blur-[80px]" />

      <Tilt max={9} className="rounded-[26px]">
        {/* Borda animada */}
        <div className="relative overflow-hidden rounded-[26px] p-px">
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 aspect-square w-[160%] -translate-x-1/2 -translate-y-1/2 animate-spin-slow [background:conic-gradient(from_0deg,transparent_0%,#ff2a47_10%,transparent_25%,transparent_50%,#ff5e1f_60%,transparent_75%)]"
          />
          <div className="relative overflow-hidden rounded-[25px] bg-ink-900">
            <div aria-hidden className="grid-lines absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,#000,transparent)]" />
            <div aria-hidden className="absolute -right-16 -top-16 size-56 rounded-full bg-gold-400/15 blur-3xl" />
            <div aria-hidden className="scanlines absolute inset-0 opacity-40" />

            {/* Cabeçalho */}
            <div className="relative flex items-center justify-between border-b border-white/[0.07] p-5">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <LogoMark className="size-12" />
                  <span className="absolute -bottom-1 -right-1 grid size-5 place-items-center rounded-full bg-ink-900">
                    <BadgeCheck className="size-4 text-gold-400" />
                  </span>
                </div>
                <div>
                  <p className="font-tech text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-400">
                    Tier lendário
                  </p>
                  <p className="font-display text-2xl uppercase tracking-wide">Conta Lendária</p>
                </div>
              </div>
              <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 font-tech text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                <span className="size-1.5 animate-blink rounded-full bg-emerald-400" />
                Disponível
              </span>
            </div>

            {/* Corpo */}
            <div className="relative space-y-5 p-5">
              <div>
                <div className="mb-2 flex items-end justify-between">
                  <p className="font-tech text-[11px] font-semibold uppercase tracking-[0.25em] text-bone-500">
                    Nível
                  </p>
                  <p className="font-display text-3xl leading-none">
                    <AnimatedCounter value={8000} duration={2.4} />
                  </p>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 0.94 }}
                    transition={{ delay: 0.9, duration: 2.2, ease: EASE_OUT_EXPO }}
                    className="h-full origin-left rounded-full bg-linear-to-r from-blood-700 via-blood-500 to-ember-500 shadow-[0_0_12px_rgba(255,42,71,0.8)]"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
                <p className="font-tech text-[11px] font-semibold uppercase tracking-[0.25em] text-bone-500">
                  Dinheiro em conta
                </p>
                <p className="mt-1 font-display text-[2.15rem] leading-none text-gold-300 drop-shadow-[0_0_18px_rgba(255,201,77,0.35)] sm:text-[2.5rem]">
                  <AnimatedCounter value={10_000_000_000} prefix="$" duration={2.8} />
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {miniStats.map(({ icon: Icon, value, label }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 + i * 0.12, duration: 0.7, ease: EASE_OUT_EXPO }}
                    className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3 text-center"
                  >
                    <Icon className="mx-auto size-5 text-blood-500" strokeWidth={1.8} />
                    <p className="mt-1.5 font-display text-xl leading-none">{value}</p>
                    <p className="mt-1 font-tech text-[9px] font-semibold uppercase tracking-[0.2em] text-bone-500">
                      {label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Rodapé */}
            <div className="relative flex items-center justify-between border-t border-white/[0.07] bg-ink-950/50 p-5">
              <div>
                <p className="text-xs text-bone-500">a partir de</p>
                <p className="font-display text-3xl leading-none tracking-wide">{formatBRL(price)}</p>
              </div>
              <Link
                href="/contas/conta-lendaria"
                className="clip-corner group/cta inline-flex h-11 items-center gap-2 bg-linear-to-r from-blood-700 to-blood-500 px-5 font-tech text-xs font-semibold uppercase tracking-[0.12em] text-white [--cut:9px]"
              >
                Ver conta
                <ArrowRight className="size-4 transition-transform group-hover/cta:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </Tilt>
    </div>
  );
}
