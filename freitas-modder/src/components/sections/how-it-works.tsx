"use client";

import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { ButtonLink } from "@/components/ui/button";
import { SplitWords } from "@/components/effects/split-words";
import { siteConfig } from "@/config/site";

const { business } = siteConfig;

const steps = [
  {
    title: "Escolha",
    text: "Escolha a conta ou o serviço e o seu console, PS4 ou PS5.",
  },
  {
    title: "Pague no Pix",
    text: "Finalize pelo WhatsApp e pague no Pix ou no cartão.",
  },
  {
    title: "Receba e jogue",
    text: `A conta chega no seu WhatsApp em até ${business.avgDeliveryMinutes} minutos. Nos serviços, a gente avisa quando terminar.`,
  },
];

function Step({
  index,
  progress,
  title,
  text,
}: {
  index: number;
  progress: MotionValue<number>;
  title: string;
  text: string;
}) {
  const start = index / steps.length;
  const fill = useTransform(progress, [start, start + 0.18], [0, 1]);
  const lift = useTransform(progress, [start, start + 0.18], [16, 0]);

  return (
    <li className="pt-8">
      <span className="relative block font-display text-8xl font-extrabold italic leading-none">
        <span className="text-transparent [-webkit-text-stroke:2px_rgba(255,255,255,0.45)]">{index + 1}</span>
        <motion.span style={{ opacity: fill }} className="absolute inset-0 text-ink-950">
          {index + 1}
        </motion.span>
      </span>
      <motion.div style={{ y: lift }}>
        <h3 className="mt-5 text-2xl font-semibold">{title}</h3>
        <p className="mt-2 max-w-xs text-[17px] leading-relaxed text-white/85">{text}</p>
      </motion.div>
    </li>
  );
}

/** Selo com texto girando em volta. */
function Seal() {
  const text = `GARANTIA DE ${business.warrantyDays} DIAS · SEM CUSTO · `;
  return (
    <div className="relative grid size-36 shrink-0 place-items-center sm:size-40">
      <svg viewBox="0 0 200 200" className="absolute inset-0 size-full animate-spin-slow" aria-hidden>
        <defs>
          <path id="seal-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text className="fill-white font-display text-[19px] font-extrabold uppercase tracking-[0.22em]">
          <textPath href="#seal-circle">{text}</textPath>
        </text>
      </svg>
      <div className="grid size-[56%] place-items-center rounded-full bg-brand-500">
        <span className="font-display text-4xl font-extrabold italic leading-none">{business.warrantyDays}</span>
      </div>
    </div>
  );
}

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<HTMLOListElement>(null);

  // A faixa vermelha "abre" enquanto entra na tela.
  const { scrollYProgress: enter } = useScroll({
    target: sectionRef,
    offset: ["start end", "start 0.2"],
  });
  const clipPath = useTransform(
    enter,
    [0, 1],
    ["inset(7% 6% 0% 6% round 48px)", "inset(0% 0% 0% 0% round 0px)"],
  );

  // Os passos acendem em sequência conforme a rolagem.
  const { scrollYProgress } = useScroll({
    target: stepsRef,
    offset: ["start 85%", "end 55%"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26 });

  return (
    <motion.section
      ref={sectionRef}
      id="como-funciona"
      style={{ clipPath }}
      className="bg-brand-500 text-white"
    >
      <div className="mx-auto max-w-6xl px-5 py-24 sm:py-28">
        <h2 className="font-display text-5xl font-extrabold uppercase leading-[0.9] sm:text-7xl">
          <SplitWords text="Como funciona" />
        </h2>

        <div className="relative mt-14">
          <div aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-white/25" />
          <motion.div
            aria-hidden
            style={{ scaleX: progress }}
            className="absolute inset-x-0 top-0 h-0.5 origin-left bg-ink-950"
          />
          <ol ref={stepsRef} className="grid gap-10 md:grid-cols-3 md:gap-8">
            {steps.map((step, i) => (
              <Step key={step.title} index={i} progress={progress} title={step.title} text={step.text} />
            ))}
          </ol>
        </div>

        <div className="mt-16 flex flex-col gap-8 rounded-3xl bg-ink-950 p-7 sm:flex-row sm:items-center sm:p-9">
          <Seal />
          <div className="flex-1">
            <p className="font-display text-4xl font-extrabold uppercase leading-none sm:text-5xl">
              Garantia de {business.warrantyDays} dias
            </p>
            <p className="mt-3 max-w-xl text-[17px] leading-relaxed text-stone-400">
              Se acontecer qualquer problema com o que você comprou nesse prazo, a
              gente repõe ou resolve sem custo.
            </p>
          </div>
          <ButtonLink href="/termos" variant="secondary" className="self-start sm:self-center">
            Ler os termos
          </ButtonLink>
        </div>
      </div>
    </motion.section>
  );
}
