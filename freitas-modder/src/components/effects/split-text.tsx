"use client";

import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";
import { EASE_OUT_EXPO } from "./reveal";

const word: Variants = {
  hidden: { y: "115%", rotate: 4 },
  show: {
    y: "0%",
    rotate: 0,
    transition: { duration: 0.9, ease: EASE_OUT_EXPO },
  },
};

/** Revela um texto palavra por palavra, subindo de uma "máscara". */
export function SplitText({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.07,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
}) {
  const words = text.split(" ").filter(Boolean);

  return (
    <motion.span
      className={cn("inline", className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {words.map((w, i) => (
        <span key={`${w}-${i}`}>
          <span className="-my-[0.2em] inline-block overflow-hidden py-[0.2em] align-bottom">
            <motion.span
              className={cn("-my-[0.2em] inline-block origin-bottom-left py-[0.2em]", wordClassName)}
              variants={word}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </motion.span>
  );
}
