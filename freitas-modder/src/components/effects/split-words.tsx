"use client";

import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";
import { EASE } from "./reveal";

// "transform" inteiro: a placa de vídeo anima sozinha (ver reveal.tsx)
const word: Variants = {
  hidden: { transform: "translateY(110%)" },
  show: { transform: "translateY(0%)", transition: { duration: 0.85, ease: EASE } },
};

/** Título que sobe palavra por palavra, saindo de uma máscara. */
export function SplitWords({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const words = text.split(" ").filter(Boolean);
  return (
    <motion.span
      className={cn("inline", className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: delay } } }}
    >
      {words.map((w, i) => (
        <span key={`${w}-${i}`}>
          <span className="-my-[0.14em] inline-block overflow-hidden py-[0.14em] align-bottom">
            <motion.span className="inline-block" variants={word}>
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </motion.span>
  );
}
