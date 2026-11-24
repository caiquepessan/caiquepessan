"use client";

import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { ButtonLink } from "@/components/ui/button";
import { SplitWords } from "@/components/effects/split-words";
import { siteConfig } from "@/config/site";
import { useRichEffects } from "@/lib/device";

const { business } = siteConfig;

const steps = [
  {
    title: "Peça pelo site",
    text: "Escolha o pacote e o console. O pedido vira um ticket, onde você fala direto com o Freitas.",
  },
  {
    title: "Pague no Pix",
    text: "O Freitas responde com o valor e a chave Pix. Você manda o comprovante no ticket.",
  },
  {
    title: "Libere o acesso",
    text: "Ele manda um QR Code. Você escaneia no app da PlayStation e libera a entrada dele na sua conta, sem passar senha.",
  },
  {
    title: "Receba e jogue",
    text: "Ele faz o serviço na sua conta, manda os prints como prova e marca como entregue.",
  },
];

function Step({
  index,
  progress,
  title,
  text,
  rich,
}: {
  index: number;
  progress: MotionValue<number>;
  title: string;
  text: string;
  /** No celular os passos já aparecem acesos (sem acompanhar a rolagem). */
  rich: boolean;
}) {
  const start = index / steps.length;
  const fill = useTransform(progress, [start, start + 0.18], [0, 1]);
  const lift = useTransform(progress, [start, start + 0.18], [16, 0]);

  return (
    <li className="pt-8">
      <span className="relative block font-display text-8xl font-extrabold italic leading-none">
        <span className="text-transparent [-webkit-text-stroke:2px_rgba(255,255,255,0.45)]">{index + 1}</span>
        <motion.span style={rich ? { opacity: fill } : undefined} className="absolute inset-0 text-ink-950">
          {index + 1}
        </motion.span>
      </span>
      <motion.div style={rich ? { y: lift } : undefined}>
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
  const rich = useRichEffects();
  const sectionRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<HTMLOListElement>(null);

  // A faixa vermelha "abre" enquanto entra na tela (só no computador: no
  // celular, recortar a seção a cada quadro de rolagem trava).
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
      style={rich ? { clipPath } : undefined}
      className="bg-brand-500 text-white"
    >
      <div className="mx-auto max-w-6xl px-5 py-24 sm:py-28">
        <h2 className="font-display text-5xl font-extrabold uppercase leading-[0.9] sm:text-7xl">
          <SplitWords text="Como funciona" />
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85">
          Dinheiro, level e Unlock All são feitos pelo Freitas dentro da sua conta da PSN.
          Por isso o atendimento é por ticket, passo a passo, com prova no final.
        </p>

        <div className="relative mt-14">
          <div aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-white/25" />
          <motion.div
            aria-hidden
            style={rich ? { scaleX: progress } : undefined}
            className="absolute inset-x-0 top-0 h-0.5 origin-left bg-ink-950"
          />
          <ol ref={stepsRef} className="grid gap-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
            {steps.map((step, i) => (
              <Step
                key={step.title}
                index={i}
                progress={progress}
                title={step.title}
                text={step.text}
                rich={rich}
              />
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
