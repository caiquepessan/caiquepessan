"use client";

import { motion } from "motion/react";

const words = [
  { text: "FREITAS", className: "text-white" },
  { text: "MODDER", className: "text-brand-500" },
];

/** A marca gigante no fim da página, subindo letra por letra. */
export function BigWordmark() {
  return (
    <motion.p
      aria-hidden
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.035 } } }}
      className="flex select-none justify-between pr-[0.06em] font-display text-[length:min(calc((100vw-48px)/6.5),11rem)] font-extrabold uppercase italic leading-[0.8]"
    >
      {words.map((word) => (
        <span key={word.text} className={`flex ${word.className}`}>
          {word.text.split("").map((letter, i) => {
            return (
              <span key={`${word.text}-${i}`} className="-mb-[0.06em] inline-block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="inline-block"
                  variants={{
                    hidden: { y: "105%" },
                    show: { y: "0%", transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
                  }}
                >
                  {letter}
                </motion.span>
              </span>
            );
          })}
        </span>
      ))}
    </motion.p>
  );
}
