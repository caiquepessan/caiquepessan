"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import type { ReactNode } from "react";
import { useRichEffects } from "@/lib/device";

function Line({
  children,
  delay,
  progress,
  distance,
  rich,
}: {
  children: ReactNode;
  delay: number;
  progress: MotionValue<number>;
  distance: number;
  rich: boolean;
}) {
  // Cada linha sobe numa velocidade diferente ao rolar: dá profundidade.
  const y = useTransform(progress, [0, 1], [0, -distance]);
  return (
    <motion.span style={rich ? { y } : undefined} className="-my-[0.12em] block overflow-hidden py-[0.12em]">
      <span
        className="after-intro block animate-rise"
        style={{ ["--d" as string]: `${delay}ms` }}
      >
        {children}
      </span>
    </motion.span>
  );
}

/**
 * Título do topo: linhas entram por baixo e, no computador, se separam
 * no scroll (no celular ficam paradas: é o momento em que a página mais
 * trabalha).
 */
export function HeroTitle() {
  const { scrollY } = useScroll();
  const progress = useTransform(scrollY, [0, 700], [0, 1]);
  const rich = useRichEffects();

  return (
    <h1 className="mt-5 font-display text-[3.4rem] font-extrabold uppercase leading-[0.86] xs:text-[4rem] sm:text-[5.5rem] lg:text-[5rem] xl:text-[6rem]">
      <Line delay={80} progress={progress} distance={20} rich={rich}>
        Dinheiro,
      </Line>
      <Line delay={160} progress={progress} distance={45} rich={rich}>
        level e tudo
      </Line>
      <Line delay={240} progress={progress} distance={70} rich={rich}>
        liberado no
      </Line>
      <Line delay={320} progress={progress} distance={100} rich={rich}>
        <span className="text-brand-500">seu GTA V.</span>
      </Line>
    </h1>
  );
}
