"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ConsoleSwitch } from "@/components/product/console-switch";
import { Odometer } from "@/components/product/odometer";
import { findVariant, getProduct, platforms, type Platform } from "@/data/products";
import { cn, formatBRL } from "@/lib/utils";
import { useConsole } from "@/store/console";

/** O pacote em destaque no topo. */
const product = getProduct("dinheiro-500-milhoes")!;
const specs = [
  ...product.specs.filter((spec) => spec.label !== "Dinheiro"),
  { label: "Onde entra", value: "No seu personagem" },
].slice(0, 3);
const money = `$${new Intl.NumberFormat("pt-BR").format(product.amount ?? 0)}`;
const ease = [0.22, 1, 0.36, 1] as const;

/** Cada console tem o seu acabamento: PS5 vermelho, PS4 preto. */
type Finish = "red" | "black";
const finishOf: Record<Platform, Finish> = { ps5: "red", ps4: "black" };

/** Meia espessura do card (px) e as camadas que formam a borda. */
const HALF = 4;
const EDGE_Z = [2, 0, -2];
const EDGE_COLOR: Record<Finish, string> = { red: "#8e0d1e", black: "#141416" };

/** PS5 mostra a frente do card; PS4, o verso. */
const flipAngle = (p: Platform) => (p === "ps5" ? 0 : -180);
const otherOf = (p: Platform): Platform => (p === "ps5" ? "ps4" : "ps5");
const clamp = (v: number) => Math.max(-1, Math.min(1, v));

function mix(a: string, b: string, t: number) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * t)).join(" ")})`;
}

/** Segundos de espera se a abertura estiver tocando. */
function introDelay() {
  if (typeof document === "undefined") return 0;
  return document.documentElement.dataset.intro === "on" ? 1.15 : 0;
}

/**
 * Fica true pouco depois de o console salvo ser lido. Até lá, a troca
 * acontece sem girar (quem volta com PS4 salvo não vê o card girando
 * sozinho ao abrir o site).
 */
function useConsoleReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const done = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setReady(true), 150);
    };
    if (useConsole.persist.hasHydrated()) done();
    const unsubscribe = useConsole.persist.onFinishHydration(done);
    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);
  return ready;
}

/**
 * Dois cards em 3D: na frente o pacote de $500 milhões no console escolhido, atrás o
 * do outro console. Ao trocar de console, os dois giram e trocam de lado.
 */
export function HeroCards() {
  const platform = useConsole((s) => s.platform);
  const setPlatform = useConsole((s) => s.setPlatform);
  const reduce = useReducedMotion();
  const ready = useConsoleReady();
  const sceneRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sceneRef, { margin: "120px" });
  const wait = introDelay();

  // Giro da troca de console (com uma sobra no fim, como card de verdade)
  const angle = flipAngle(platform);
  const frontFlip = useSpring(angle, { stiffness: 46, damping: 10, mass: 1 });
  const backFlip = useSpring(angle, { stiffness: 38, damping: 9.5, mass: 1 });
  const lift = useMotionValue(0);

  useEffect(() => {
    if (!ready || reduce) {
      frontFlip.jump(angle);
      backFlip.jump(angle);
      return;
    }
    if (frontFlip.get() === angle) return;
    frontFlip.set(angle);
    const timer = setTimeout(() => backFlip.set(angle), 140);
    animate(lift, [0, 1, 0], {
      duration: 1,
      times: [0, 0.32, 1],
      ease: "easeInOut",
    });
    if (glowRef.current) {
      animate(
        glowRef.current,
        { opacity: [0.5, 1, 0.5], scale: [1, 1.18, 1] },
        { duration: 1.1, ease: "easeOut" },
      );
    }
    return () => clearTimeout(timer);
  }, [angle, ready, reduce, frontFlip, backFlip, lift]);

  // O balanço sozinho é animação de CSS (.card-sway): roda na placa de
  // vídeo e o texto continua nítido. Fora da tela, ele pausa.
  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    if (inView) delete el.dataset.offscreen;
    else el.dataset.offscreen = "";
  }, [inView]);

  // Com o mouse em cima, o balanço pausa e o card segue o mouse
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const fx = useSpring(px, { stiffness: 120, damping: 18, mass: 0.6 });
  const fy = useSpring(py, { stiffness: 120, damping: 18, mass: 0.6 });
  const bx = useSpring(px, { stiffness: 60, damping: 15, mass: 0.8 });
  const by = useSpring(py, { stiffness: 60, damping: 15, mass: 0.8 });

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = sceneRef.current;
    if (reduce || e.pointerType !== "mouse" || !el) return;
    const rect = el.getBoundingClientRect();
    el.dataset.hover = "";
    px.set(clamp(((e.clientX - rect.left) / rect.width) * 2 - 1));
    py.set(clamp(((e.clientY - rect.top) / rect.height) * 2 - 1));
  }

  function handlePointerLeave() {
    const el = sceneRef.current;
    if (el) delete el.dataset.hover;
    px.set(0);
    py.set(0);
  }

  const frontRotateY = useTransform(() => frontFlip.get() + fx.get() * 15);
  const frontRotateX = useTransform(() => fy.get() * -10);
  const backRotateY = useTransform(() => backFlip.get() + bx.get() * 10);
  const backRotateX = useTransform(() => by.get() * -7);
  const frontZ = useTransform(lift, [0, 1], [0, 90]);
  const backZ = useTransform(lift, [0, 1], [0, 28]);
  const shadowScale = useTransform(lift, [0, 1], [1, 0.74]);
  const shadowOpacity = useTransform(lift, [0, 1], [1, 0.5]);

  // Ao rolar, os cards sobem mais rápido e giram um pouco. Só no
  // computador: no celular eles ficam embaixo do texto e subiriam por cima.
  const { scrollY } = useScroll();
  const parallax = useMotionValue(0);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => parallax.set(mq.matches ? 1 : 0);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [parallax]);
  const scrolled = useTransform(() => (Math.min(scrollY.get(), 800) / 800) * parallax.get());
  const y = useTransform(scrolled, (v) => v * -140);
  const rotate = useTransform(scrolled, (v) => v * -6);

  return (
    <motion.div
      style={{ y, rotate }}
      className="relative mx-auto w-full max-w-[460px] pt-16 lg:mr-0"
    >
      <div className="after-intro animate-fade-up" style={{ ["--d" as string]: "150ms" }}>
        <div className="animate-float">
          <motion.div
            ref={sceneRef}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            initial="hidden"
            animate="show"
            whileHover="hover"
            className="card-scene @container relative perspective-[1600px]"
          >
            {/* Luz vermelha atrás (pulsa na troca) */}
            <div
              ref={glowRef}
              aria-hidden
              className="pointer-events-none absolute -inset-[22%] -z-10 bg-[radial-gradient(closest-side,rgba(232,24,44,0.4),transparent)] opacity-50"
            />
            {/* Sombra no chão: diminui quando o card sobe */}
            <motion.div
              aria-hidden
              style={{ scale: shadowScale, opacity: shadowOpacity }}
              className="pointer-events-none absolute inset-x-[10%] -bottom-12 h-14 rounded-[50%] bg-black/75 blur-2xl"
            />

            {/* Card de trás: a edição do outro console. Clicar troca. */}
            <motion.div
              aria-hidden
              data-cursor="swap"
              onClick={() => setPlatform(otherOf(platform))}
              className="absolute inset-0 cursor-pointer transform-3d"
              variants={{
                hidden: { x: 0, y: 0, z: 0, rotate: 0 },
                show: {
                  x: -14,
                  y: -66,
                  z: -60,
                  rotate: 4,
                  transition: { delay: 0.55 + wait, duration: 1, ease },
                },
                hover: {
                  x: -18,
                  y: -86,
                  z: -60,
                  rotate: 6,
                  transition: { duration: 0.5, ease },
                },
              }}
            >
              <Card
                faces={["ps4", "ps5"]}
                rotateX={backRotateX}
                rotateY={backRotateY}
                z={backZ}
                sway="card-sway-back"
              />
            </motion.div>

            {/* Card da frente: gira entre PS5 e PS4 */}
            <motion.div
              className="relative transform-3d"
              variants={{
                hidden: { rotate: 0, z: 0 },
                show: {
                  rotate: -2,
                  z: 0,
                  transition: { delay: 0.55 + wait, duration: 1, ease },
                },
                hover: {
                  rotate: -1,
                  z: 24,
                  transition: { duration: 0.5, ease },
                },
              }}
            >
              <Card
                faces={["ps5", "ps4"]}
                rotateX={frontRotateX}
                rotateY={frontRotateY}
                z={frontZ}
                sway="card-sway"
                active={platform}
                rollDelay={ready ? 0.3 : 0.6 + wait}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div
        className="after-intro relative mt-16 flex animate-fade-up items-center justify-center gap-3"
        style={{ ["--d" as string]: "260ms" }}
      >
        <span aria-hidden className="text-sm text-stone-400">
          Seu console
        </span>
        <ConsoleSwitch />
      </div>
    </motion.div>
  );
}

/** Um card com duas faces (uma por console) e espessura de verdade. */
function Card({
  faces,
  rotateX,
  rotateY,
  z,
  sway,
  active,
  rollDelay = 0,
}: {
  faces: [Platform, Platform];
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  z: MotionValue<number>;
  /** Classe do balanço (o de trás balança menos). */
  sway: "card-sway" | "card-sway-back";
  /** Console à mostra (só no card da frente, que tem link e profundidade). */
  active?: Platform;
  rollDelay?: number;
}) {
  const [a, b] = faces;
  const front = active !== undefined;

  return (
    <div className={cn("transform-3d", sway)}>
      <motion.div style={{ rotateX, rotateY, z }} className="relative transform-3d">
        {/* Borda: camadas entre as duas faces, do vermelho para o preto */}
        {EDGE_Z.map((ez, i) => (
          <div
            key={ez}
            aria-hidden
            className="absolute inset-0 rounded-[28px]"
            style={{
              transform: `translateZ(${ez}px)`,
              background: mix(
                EDGE_COLOR[finishOf[a]],
                EDGE_COLOR[finishOf[b]],
                (i + 1) / (EDGE_Z.length + 1),
              ),
            }}
          />
        ))}
        <Face
          platform={a}
          side="a"
          rotateX={rotateX}
          rotateY={rotateY}
          front={front}
          active={active === a}
          rollDelay={rollDelay}
        />
        <Face
          platform={b}
          side="b"
          rotateX={rotateX}
          rotateY={rotateY}
          front={front}
          active={active === b}
          rollDelay={rollDelay}
        />
      </motion.div>
    </div>
  );
}

function Face({
  platform,
  side,
  rotateX,
  rotateY,
  front,
  active,
  rollDelay,
}: {
  platform: Platform;
  side: "a" | "b";
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  front: boolean;
  active: boolean;
  rollDelay: number;
}) {
  const red = finishOf[platform] === "red";
  const variant = findVariant(product, platform);
  const label = platforms[platform].label;

  // Ângulo desta face em relação a quem olha (giro e mouse): move brilho e
  // holográfico. O balanço sozinho move os mesmos brilhos pelo CSS.
  const offset = side === "a" ? 0 : 180;
  const glossX = useTransform(rotateY, (v) => -(v + offset) * 5.5);
  const glossY = useTransform(rotateX, (v) => v * 6);
  const glintX = useTransform(rotateY, (v) => -(v + offset) * 14);
  const holoX = useTransform(rotateY, (v) => -(v + offset) * 2.4);

  /** Camadas soltas do card: só o da frente tem profundidade. */
  const depth = (px: number): CSSProperties | undefined =>
    front ? { transform: `translateZ(${px}px)` } : undefined;

  return (
    <div
      inert={front && !active}
      className={cn("transform-3d", side === "a" ? "relative" : "absolute inset-0")}
      style={{
        transform: side === "a" ? `translateZ(${HALF}px)` : `rotateY(180deg) translateZ(${HALF}px)`,
      }}
    >
      {/* Superfície: cor, listras, número do console gravado e brilho */}
      <div className={cn("card-surface backface-hidden", red ? "card-red" : "card-black")}>
        <span className="card-lines" />
        <span className="card-watermark">{label}</span>
        <motion.span className="card-gloss" style={{ x: glossX, y: glossY }} />
        <motion.span className="card-glint" style={{ x: glintX }} />
      </div>

      {/* Conteúdo em camadas, cada uma numa altura */}
      <div className="relative p-6 transform-3d sm:p-7">
        <div className="flex items-center justify-between gap-3 transform-3d">
          <span className="card-chip backface-hidden" style={depth(30)}>
            <motion.span aria-hidden className="card-holo" style={{ x: holoX }} />
            <span className="relative">{label}</span>
          </span>
          <p
            className={cn(
              "text-[13px] font-semibold uppercase tracking-[0.12em] backface-hidden",
              red ? "text-white/85" : "text-stone-300",
            )}
            style={depth(16)}
          >
            {product.tag ?? product.name}
          </p>
        </div>

        <div className="mt-9 backface-hidden" style={depth(46)}>
          <p className={cn("text-[15px] font-medium", red ? "text-white/80" : "text-stone-400")}>
            Dinheiro na sua conta
          </p>
          <div
            className={cn(
              "mt-1 font-display text-[12.5cqw] font-extrabold italic leading-none",
              red ? "card-num-red" : "card-num-black",
            )}
          >
            {active ? (
              <Odometer value={product.amount ?? 0} delay={rollDelay} />
            ) : (
              <span className="tabular-nums">{money}</span>
            )}
          </div>
        </div>

        <dl
          className={cn(
            "mt-7 grid grid-cols-3 gap-3 border-t pt-5 backface-hidden",
            red ? "border-white/25" : "border-white/10",
          )}
          style={depth(22)}
        >
          {specs.map((spec) => (
            <div key={spec.label}>
              <dt className={cn("text-[13px]", red ? "text-white/70" : "text-stone-500")}>
                {spec.label}
              </dt>
              <dd className="mt-0.5 font-semibold leading-tight text-white">{spec.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-7 flex items-end justify-between gap-4 transform-3d">
          <div className="backface-hidden" style={depth(30)}>
            <p className={cn("text-[13px]", red ? "text-white/70" : "text-stone-500")}>no Pix</p>
            <p className="font-display text-4xl font-extrabold leading-none text-white tabular-nums">
              {variant ? formatBRL(variant.price) : "Consulte"}
            </p>
          </div>
          {front ? (
            <Link
              href={`/loja/${product.slug}`}
              prefetch
              data-cursor="link"
              style={depth(52)}
              className={cn(
                "group/link inline-flex h-11 items-center gap-1.5 rounded-xl px-4 text-[15px] font-semibold text-white transition-colors backface-hidden",
                red
                  ? "bg-ink-950 shadow-[0_10px_24px_-10px_rgba(0,0,0,0.8)] hover:bg-ink-800"
                  : "bg-brand-500 shadow-[0_10px_28px_-10px_rgba(232,24,44,0.9)] hover:bg-brand-600",
              )}
            >
              Ver pacote
              <ArrowRight className="size-4 transition-transform duration-200 group-hover/link:translate-x-0.5" />
            </Link>
          ) : (
            <span
              className={cn(
                "inline-flex h-11 items-center rounded-xl px-4 text-[15px] font-semibold text-white backface-hidden",
                red ? "bg-ink-950" : "bg-brand-500",
              )}
            >
              Ver pacote
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
