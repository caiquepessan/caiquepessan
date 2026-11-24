"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { isLiteDevice } from "@/lib/device";
import { cn } from "@/lib/utils";

/**
 * Faixa infinita. O movimento é uma animação da própria placa de vídeo
 * (não recalcula a página a cada quadro). No computador ela ainda acelera
 * quando a página rola e inverte o sentido quando a rolagem volta.
 */
export function VelocityMarquee({
  children,
  baseVelocity = 3,
  className,
}: {
  children: ReactNode;
  /** % da faixa por segundo; negativo anda para o outro lado. */
  baseVelocity?: number;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // As duas cópias juntas medem 100%: andar 50% é uma volta completa.
    const forward = baseVelocity > 0;
    const animation = track.animate(
      forward
        ? [{ transform: "translateX(-50%)" }, { transform: "translateX(0%)" }]
        : [{ transform: "translateX(0%)" }, { transform: "translateX(-50%)" }],
      { duration: (50 / Math.abs(baseVelocity)) * 1000, iterations: Infinity, easing: "linear" },
    );

    // Celular: só a velocidade base, sem olhar a rolagem.
    if (isLiteDevice()) return () => animation.cancel();

    let lastY = window.scrollY;
    let lastT = performance.now();
    let target = 0; // px/s da rolagem
    let current = 0;
    let direction = 1;
    let raf = 0;
    let idle: ReturnType<typeof setTimeout> | undefined;

    const tick = () => {
      current += (target - current) * 0.12;
      const factor = (current / 1000) * 4;
      if (factor < -0.01) direction = -1;
      else if (factor > 0.01) direction = 1;
      animation.updatePlaybackRate(direction * (1 + Math.abs(factor)));
      if (Math.abs(current - target) < 2 && target === 0) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      const now = performance.now();
      const dt = Math.max(16, now - lastT);
      target = ((window.scrollY - lastY) / dt) * 1000;
      lastY = window.scrollY;
      lastT = now;
      clearTimeout(idle);
      idle = setTimeout(() => (target = 0), 120);
      if (!raf) raf = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      clearTimeout(idle);
      animation.cancel();
    };
  }, [baseVelocity]);

  return (
    <div className={cn("flex overflow-hidden whitespace-nowrap", className)}>
      <div ref={trackRef} className="flex w-max shrink-0">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
