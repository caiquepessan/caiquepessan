"use client";

import { useCallback, useEffect, useRef } from "react";
import { isLiteDevice } from "@/lib/device";
import { cn } from "@/lib/utils";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#%&";

/**
 * Texto que "embaralha" e se acerta letra por letra, como um mod
 * carregando. Reserva a largura final para não empurrar o layout.
 */
export function Scramble({
  text,
  className,
  onMount = false,
  delay = 0,
}: {
  text: string;
  className?: string;
  /** Embaralha ao aparecer (além de no hover). */
  onMount?: boolean;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const frame = useRef(0);

  const run = useCallback(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    cancelAnimationFrame(frame.current);
    let step = 0;
    const total = text.length * 2 + 8;
    const tick = () => {
      el.textContent = text
        .split("")
        .map((char, i) => {
          if (char === " " || step > i * 2 + 6) return char;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join("");
      step += 1;
      if (step < total) frame.current = requestAnimationFrame(tick);
      else el.textContent = text;
    };
    tick();
  }, [text]);

  useEffect(() => {
    // No celular o texto já aparece pronto: a página está carregando nessa hora.
    if (!onMount || isLiteDevice()) return;
    const id = window.setTimeout(run, delay);
    return () => {
      window.clearTimeout(id);
      cancelAnimationFrame(frame.current);
    };
  }, [onMount, delay, run]);

  return (
    <span className={cn("relative inline-block whitespace-nowrap", className)} onMouseEnter={run}>
      <span className="invisible" aria-hidden>
        {text}
      </span>
      <span ref={ref} aria-hidden className="absolute inset-0">
        {text}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
