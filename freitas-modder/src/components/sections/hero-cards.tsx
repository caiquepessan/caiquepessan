"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Tilt } from "@/components/effects/tilt";
import { AnimatedPrice } from "@/components/product/animated-price";
import { Odometer } from "@/components/product/odometer";
import { findVariant, getProduct, platforms } from "@/data/products";
import { useConsole } from "@/store/console";

const front = getProduct("conta-pro")!;
const back = getProduct("conta-lendaria")!;
const ease = [0.22, 1, 0.36, 1] as const;

/** Segundos de espera se a abertura estiver tocando. */
function introDelay() {
  if (typeof document === "undefined") return 0;
  return document.documentElement.dataset.intro === "on" ? 1.15 : 0;
}

/** Dois cards empilhados: a Conta Pro na frente, a Lendária atrás. */
export function HeroCards() {
  const platform = useConsole((s) => s.platform);
  const variant = findVariant(front, platform);
  const wait = introDelay();

  // Ao rolar, os cards sobem mais rápido e giram um pouco.
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, -140]);
  const rotate = useTransform(scrollY, [0, 800], [0, -6]);

  return (
    <motion.div style={{ y, rotate }} className="relative mx-auto w-full max-w-[460px] lg:mr-0">
      <div className="after-intro animate-fade-up" style={{ ["--d" as string]: "150ms" }}>
        <div className="animate-float">
          <motion.div className="group relative" initial="hidden" animate="show" whileHover="hover">
            {/* Card de trás */}
            <motion.div
              aria-hidden
              className="absolute inset-0 rounded-[28px] bg-black p-7 ring-1 ring-inset ring-brand-500/50"
              variants={{
                hidden: { rotate: 0, x: 0, y: 0 },
                show: { rotate: -7, x: -26, y: 8, transition: { delay: 0.55 + wait, duration: 1, ease } },
                hover: { rotate: -11, x: -40, y: 4, transition: { duration: 0.5, ease } },
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
              variants={{
                hidden: { rotate: 0 },
                show: { rotate: 2, transition: { delay: 0.55 + wait, duration: 1, ease } },
                hover: { rotate: 0.5, transition: { duration: 0.5, ease } },
              }}
            >
              <Tilt max={10} className="rounded-[28px]">
                <div className="shine shine-loop @container relative rounded-[28px] bg-brand-500 p-6 text-white shadow-[0_40px_80px_-30px_rgba(232,24,44,0.7)] sm:p-7">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-white/80">
                      {front.name}
                    </p>
                    <span className="rounded-full bg-black/20 px-3 py-1 text-[13px] font-semibold">
                      {platforms[platform].label}
                    </span>
                  </div>

                  <p className="mt-10 text-[15px] font-medium text-white/80">Dinheiro no banco</p>
                  <div
                    className="transition-transform duration-300 ease-out"
                    style={{
                      transform:
                        "translate3d(calc((var(--px, 0.5) - 0.5) * 14px), calc((var(--py, 0.5) - 0.5) * 10px), 0)",
                    }}
                  >
                    <Odometer
                      value={front.amount ?? 0}
                      delay={0.6 + wait}
                      className="mt-1 font-display text-[12.5cqw] font-extrabold italic"
                    />
                  </div>

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
                      className="group/link relative z-30 inline-flex h-11 items-center gap-1.5 rounded-xl bg-ink-950 px-4 text-[15px] font-semibold text-white transition-colors hover:bg-ink-800"
                    >
                      Ver conta
                      <ArrowRight className="size-4 transition-transform duration-200 group-hover/link:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </Tilt>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
