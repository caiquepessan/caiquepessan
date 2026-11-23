"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { AnimatedPrice } from "@/components/product/animated-price";
import { Odometer } from "@/components/product/odometer";
import { findVariant, getProduct, platforms } from "@/data/products";
import { useConsole } from "@/store/console";

const front = getProduct("conta-pro")!;
const back = getProduct("conta-lendaria")!;
const ease = [0.22, 1, 0.36, 1] as const;

/** Dois cards empilhados: a Conta Pro na frente, a Lendária atrás. */
export function HeroCards() {
  const platform = useConsole((s) => s.platform);
  const variant = findVariant(front, platform);

  return (
    <motion.div
      className="group relative mx-auto w-full max-w-[460px] animate-fade-up [animation-delay:150ms] lg:mr-0"
      initial="hidden"
      animate="show"
      whileHover="hover"
    >
      {/* Card de trás */}
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-[28px] bg-black p-7 ring-1 ring-inset ring-brand-500/50"
        variants={{
          hidden: { rotate: 0, x: 0, y: 0 },
          show: { rotate: -6, x: -22, y: 6, transition: { delay: 0.5, duration: 0.9, ease } },
          hover: { rotate: -9, x: -34, y: 4, transition: { duration: 0.5, ease } },
        }}
      >
        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-white/50">
          {back.name.replace("Conta ", "")}
        </p>
        <p className="mt-2 font-display text-6xl font-extrabold italic text-brand-500">
          {back.headline.value}
        </p>
      </motion.div>

      {/* Card da frente */}
      <motion.div
        className="@container relative rounded-[28px] bg-brand-500 p-6 text-white shadow-[0_40px_80px_-30px_rgba(232,24,44,0.6)] sm:p-7"
        variants={{
          hidden: { y: 0, rotate: 0 },
          show: { y: 0, rotate: 2, transition: { delay: 0.5, duration: 0.9, ease } },
          hover: { y: -6, rotate: 1, transition: { duration: 0.5, ease } },
        }}
      >
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-white/80">
            {front.name}
          </p>
          <span className="rounded-full bg-black/20 px-3 py-1 text-[13px] font-semibold">
            {platforms[platform].label}
          </span>
        </div>

        <p className="mt-10 text-[15px] font-medium text-white/80">Dinheiro no banco</p>
        <Odometer
          value={front.amount ?? 0}
          delay={0.6}
          className="mt-1 font-display text-[12.5cqw] font-extrabold italic"
        />

        <dl className="mt-8 grid grid-cols-3 gap-3 border-t border-white/25 pt-5">
          {front.specs
            .filter((spec) => spec.label !== "Dinheiro")
            .slice(0, 3)
            .map((spec) => (
            <div key={spec.label}>
              <dt className="text-[13px] text-white/70">{spec.label}</dt>
              <dd className="mt-0.5 font-semibold leading-tight">{spec.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-[13px] text-white/70">no Pix</p>
            {variant && (
              <AnimatedPrice
                value={variant.price}
                className="font-display text-4xl font-extrabold leading-none"
              />
            )}
          </div>
          <Link
            href={`/contas/${front.slug}`}
            prefetch
            className="group/link inline-flex h-11 items-center gap-1.5 rounded-xl bg-ink-950 px-4 text-[15px] font-semibold text-white transition-colors hover:bg-ink-800"
          >
            Ver conta
            <ArrowRight className="size-4 transition-transform duration-200 group-hover/link:translate-x-0.5" />
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
