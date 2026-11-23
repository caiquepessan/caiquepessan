"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Embers } from "@/components/effects/embers";

/** Camadas de fundo do hero: brilhos, grade, piso em perspectiva e brasas. */
export function HeroBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textX = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const glowY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.div style={{ y: glowY }} className="absolute inset-0">
        <div className="absolute left-1/2 top-[-20%] h-[80%] w-[110%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(255,42,71,0.28),transparent_62%)]" />
        <div className="absolute -left-40 top-1/4 size-[520px] animate-float rounded-full bg-blood-700/25 blur-[120px]" />
        <div className="absolute -right-40 top-10 size-[460px] animate-float-delayed rounded-full bg-ember-500/15 blur-[120px]" />
      </motion.div>

      <div className="grid-lines fade-mask-radial absolute inset-0 opacity-70" />

      <div className="absolute left-0 top-[16%] opacity-25 lg:opacity-45">
        <motion.div
          style={{ x: textX, opacity: textOpacity }}
          className="outline-text select-none whitespace-nowrap font-display text-[30vw] uppercase leading-none tracking-tight lg:text-[22rem]"
        >
          Freitas Modder
        </motion.div>
      </div>

      <div className="grid-floor" />
      <Embers />

      <div className="absolute inset-x-0 top-0 h-px animate-scan bg-linear-to-r from-transparent via-blood-500/40 to-transparent" />
      <div className="noise absolute inset-0 opacity-[0.05] mix-blend-overlay" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-ink-950 to-transparent" />
    </div>
  );
}
