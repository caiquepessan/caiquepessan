"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useMemo, useRef } from "react";
import { EASE_OUT_EXPO } from "./reveal";

/** Número que conta de 0 até `value` quando aparece na tela. */
export function AnimatedCounter({
  value,
  decimals = 0,
  duration = 2.2,
  prefix = "",
  suffix = "",
  className,
}: {
  value: number;
  decimals?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat("pt-BR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }),
    [decimals],
  );

  useEffect(() => {
    const el = ref.current;
    if (!inView || !el) return;
    const controls = animate(0, value, {
      duration,
      ease: EASE_OUT_EXPO,
      onUpdate: (v) => {
        el.textContent = `${prefix}${formatter.format(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, value, duration, prefix, suffix, formatter]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatter.format(0)}
      {suffix}
    </span>
  );
}
