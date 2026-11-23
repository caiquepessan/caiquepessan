"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface Ember {
  x: number;
  y: number;
  size: number;
  vy: number;
  vx: number;
  life: number;
  maxLife: number;
  phase: number;
  wobble: number;
  sprite: number;
}

const COLORS = [
  ["255,236,238", "255,42,71"], // vermelho
  ["255,240,220", "255,94,31"], // brasa laranja
  ["255,250,240", "255,140,90"], // faísca clara
];

function createSprite(core: string, color: string) {
  const size = 64;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, `rgba(${core},1)`);
  grad.addColorStop(0.18, `rgba(${color},0.95)`);
  grad.addColorStop(0.45, `rgba(${color},0.28)`);
  grad.addColorStop(1, `rgba(${color},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

/** Partículas de brasa subindo. Canvas leve, que pausa fora da tela. */
export function Embers({
  className,
  density = 1,
}: {
  className?: string;
  density?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sprites = COLORS.map(([core, color]) => createSprite(core, color));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let embers: Ember[] = [];
    let raf = 0;
    let visible = true;

    const spawn = (initial: boolean): Ember => ({
      x: Math.random() * width,
      y: initial ? Math.random() * height : height + 20,
      size: 3 + Math.random() * 9,
      vy: 0.25 + Math.random() * 0.85,
      vx: (Math.random() - 0.5) * 0.25,
      life: initial ? Math.random() * 300 : 0,
      maxLife: 260 + Math.random() * 420,
      phase: Math.random() * Math.PI * 2,
      wobble: 0.006 + Math.random() * 0.02,
      sprite: Math.random() < 0.62 ? 0 : Math.random() < 0.7 ? 1 : 2,
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const isSmall = width < 640;
      const count = Math.round(
        Math.min(isSmall ? 38 : 95, (width * height) / (isSmall ? 9000 : 13000)) * density,
      );
      embers = Array.from({ length: count }, () => spawn(true));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        e.life += 1;
        e.y -= e.vy;
        e.x += e.vx + Math.sin(e.life * e.wobble + e.phase) * 0.35;
        const t = e.life / e.maxLife;
        if (t >= 1 || e.y < -30) {
          embers[i] = spawn(false);
          continue;
        }
        const fade = Math.sin(Math.PI * t);
        const flicker = 0.65 + 0.35 * Math.sin(e.life * 0.12 + e.phase);
        ctx.globalAlpha = Math.max(0, fade * flicker);
        const s = e.size * (0.7 + 0.3 * flicker);
        ctx.drawImage(sprites[e.sprite], e.x - s / 2, e.y - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (raf || reduce || !visible || document.hidden) return;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();
    if (reduce) draw();

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) draw();
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [density]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    />
  );
}
