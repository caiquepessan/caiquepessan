"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

export const EASE = [0.22, 1, 0.36, 1] as const;

/*
 * As entradas usam "transform" inteiro (e não x/y/scale soltos): assim o
 * Motion entrega a animação para a placa de vídeo, sem recalcular a página
 * a cada quadro. No celular, durante a rolagem, isso faz diferença.
 */

/** Sobe e aparece quando entra na tela (uma vez). */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, transform: "translateY(18px)" }}
      whileInView={{ opacity: 1, transform: "translateY(0px)" }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

const item: Variants = {
  hidden: { opacity: 0, transform: "translateY(22px)" },
  show: { opacity: 1, transform: "translateY(0px)", transition: { duration: 0.65, ease: EASE } },
};

/** Container que faz os <RevealItem> aparecerem em sequência. */
export function RevealGroup({
  children,
  className,
  stagger = 0.07,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}

const deal: Variants = {
  hidden: (i: number) => ({
    opacity: 0,
    transform: `translateY(90px) rotate(${(i % 4) * 3 - 5}deg) scale(0.94)`,
  }),
  show: {
    opacity: 1,
    transform: "translateY(0px) rotate(0deg) scale(1)",
    transition: { type: "spring", stiffness: 140, damping: 18, mass: 0.9 },
  },
};

/** Grade em que os itens entram como cartas sendo distribuídas. */
export function DealGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
    >
      {children}
    </motion.div>
  );
}

export function DealItem({
  children,
  className,
  index,
}: {
  children: ReactNode;
  className?: string;
  index: number;
}) {
  return (
    <motion.div className={className} custom={index} variants={deal}>
      {children}
    </motion.div>
  );
}
