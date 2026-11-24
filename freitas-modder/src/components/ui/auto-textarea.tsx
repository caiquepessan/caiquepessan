"use client";

import { useLayoutEffect, useRef, type ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Caixa de texto que cresce sozinha conforme a pessoa escreve (sem a alça
 * de redimensionar do navegador). Depois da altura máxima, rola por dentro.
 */
export function AutoTextarea({
  className,
  value,
  maxHeight = 360,
  ...props
}: ComponentProps<"textarea"> & { maxHeight?: number }) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    const height = Math.min(el.scrollHeight + 2, maxHeight);
    el.style.height = `${height}px`;
    el.style.overflowY = el.scrollHeight + 2 > maxHeight ? "auto" : "hidden";
  }, [value, maxHeight]);

  return (
    <textarea
      ref={ref}
      value={value}
      data-lenis-prevent
      className={cn("resize-none overscroll-contain", className)}
      {...props}
    />
  );
}
