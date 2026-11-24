"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const ROWS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const formatter = new Intl.NumberFormat("pt-BR");

function Digit({ digit, delay }: { digit: number; delay: number }) {
  return (
    <span aria-hidden className="relative inline-block h-[1em] overflow-x-visible overflow-y-clip">
      <motion.span
        className="flex flex-col"
        // Começa já mostrando o dígito certo (bom para o HTML do servidor)
        // e dá uma volta completa até parar nele de novo. "transform"
        // inteiro para a placa de vídeo animar sozinha.
        initial={{ transform: `translateY(-${digit * 5}%)` }}
        animate={{ transform: `translateY(-${(10 + digit) * 5}%)` }}
        transition={{ duration: 1.8, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {ROWS.map((n, i) => (
          <span key={i} className="block h-[1em] leading-none">
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

/** Número que gira como um contador mecânico. */
export function Odometer({
  value,
  prefix = "$",
  delay = 0,
  className,
}: {
  value: number;
  prefix?: string;
  delay?: number;
  className?: string;
}) {
  const text = `${prefix}${formatter.format(value)}`;
  let position = 0;

  return (
    <span className={cn("inline-flex whitespace-nowrap leading-none tabular-nums", className)}>
      <span className="sr-only">{text}</span>
      {text.split("").map((char, i) =>
        /\d/.test(char) ? (
          <Digit key={i} digit={Number(char)} delay={delay + position++ * 0.05} />
        ) : (
          <span key={i} aria-hidden className="inline-block h-[1em] leading-none">
            {char}
          </span>
        ),
      )}
    </span>
  );
}
