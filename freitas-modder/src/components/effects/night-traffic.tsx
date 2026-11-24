"use client";

import { useEffect, useRef } from "react";
import { isLiteDevice } from "@/lib/device";
import { cn } from "@/lib/utils";

interface Trail {
  x: number;
  y: number;
  depth: number;
  length: number;
  speed: number;
  width: number;
  alpha: number;
  color: string;
}

/** Faróis brancos de um lado, lanternas vermelhas do outro. */
const LANES = [
  { from: 0.58, to: 0.78, dir: 1, colors: ["255,42,60", "255,70,50", "255,20,45"] },
  { from: 0.8, to: 1.02, dir: -1, colors: ["255,244,230", "255,225,190", "255,255,255"] },
];

/**
 * Rastros de luz de carros passando à noite (como foto de longa
 * exposição de uma avenida). Canvas leve, pausa fora da tela.
 * No celular fica parado (desenha uma vez só): redesenhar o canvas a cada
 * quadro obriga o navegador a atualizar a página inteira junto.
 */
export function NightTraffic({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const lite = isLiteDevice();
    // Parado, o canvas pode ficar na memória comum: assim ele é pintado como
    // uma imagem, em vez de ganhar uma camada da placa de vídeo (que faria
    // o texto e os cards por cima dele virarem camadas também).
    const ctx = canvas?.getContext("2d", lite ? { willReadFrequently: true } : undefined);
    if (!canvas || !ctx) return;

    const reduce = lite || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, lite ? 1.5 : 2);
    let width = 0;
    let height = 0;
    let trails: Trail[] = [];
    let raf = 0;
    let visible = true;
    let last = performance.now();

    const spawn = (initial: boolean): Trail => {
      const lane = LANES[Math.random() < 0.55 ? 0 : 1];
      const depth = Math.random();
      const y = height * (lane.from + (lane.to - lane.from) * depth);
      const length = 60 + depth * depth * 520;
      const speed = (90 + depth * 900) * lane.dir;
      const x = initial
        ? Math.random() * (width + length)
        : lane.dir > 0
          ? -Math.random() * width * 0.3
          : width + length + Math.random() * width * 0.3;
      return {
        x,
        y,
        depth,
        length,
        speed,
        width: 0.6 + depth * 3.2,
        alpha: 0.18 + depth * 0.7,
        color: lane.colors[Math.floor(Math.random() * lane.colors.length)],
      };
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(70, width / 18));
      trails = Array.from({ length: count }, () => spawn(true));
    };

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      for (let i = 0; i < trails.length; i++) {
        const t = trails[i];
        t.x += t.speed * dt;
        const head = t.x;
        const tail = t.speed > 0 ? head - t.length : head + t.length;
        const offscreen = t.speed > 0 ? tail > width + 20 : tail < -20;
        if (offscreen) {
          trails[i] = spawn(false);
          continue;
        }
        const grad = ctx.createLinearGradient(tail, t.y, head, t.y);
        grad.addColorStop(0, `rgba(${t.color},0)`);
        grad.addColorStop(0.85, `rgba(${t.color},${t.alpha * 0.6})`);
        grad.addColorStop(1, `rgba(${t.color},${t.alpha})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = t.width;
        ctx.beginPath();
        ctx.moveTo(tail, t.y);
        ctx.lineTo(head, t.y);
        ctx.stroke();
      }
      ctx.globalCompositeOperation = "source-over";
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      draw(dt);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (raf || reduce || !visible || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();
    if (reduce) draw(0);

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) draw(0);
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
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    />
  );
}
