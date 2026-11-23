"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { Gamepad2, MousePointerClick, PackageCheck, Wallet } from "lucide-react";
import { useRef } from "react";
import { EASE_OUT_EXPO } from "@/components/effects/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";

const steps = [
  {
    icon: MousePointerClick,
    title: "Escolha",
    text: "Navegue pelo catálogo e escolha a conta ou o serviço ideal para a sua plataforma.",
  },
  {
    icon: Wallet,
    title: "Pague",
    text: "Finalize pelo WhatsApp e pague via PIX ou cartão, com aprovação na hora.",
  },
  {
    icon: PackageCheck,
    title: "Receba",
    text: `Os dados de acesso chegam em minutos (média de ${siteConfig.business.avgDeliveryMinutes} min), com suporte acompanhando.`,
  },
  {
    icon: Gamepad2,
    title: "Jogue",
    text: "Troque e-mail e senha, entre no online e aproveite tudo liberado.",
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 55%"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

  return (
    <section id="como-funciona" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Como funciona"
          title="Do pedido ao jogo em"
          highlight="4 passos"
          description="Sem cadastro, sem complicação. Você fala direto com quem entrega."
        />

        <div ref={ref} className="relative mt-20">
          {/* Linha de progresso (desktop: horizontal, mobile: vertical) */}
          <div aria-hidden className="absolute left-[27px] top-0 h-full w-px bg-white/[0.08] lg:left-0 lg:top-[27px] lg:h-px lg:w-full" />
          <motion.div
            aria-hidden
            style={{ scaleY: progress }}
            className="absolute left-[27px] top-0 h-full w-px origin-top bg-linear-to-b from-blood-500 to-ember-500 shadow-[0_0_12px_#ff2a47] lg:hidden"
          />
          <motion.div
            aria-hidden
            style={{ scaleX: progress }}
            className="absolute left-0 top-[27px] hidden h-px w-full origin-left bg-linear-to-r from-blood-500 to-ember-500 shadow-[0_0_12px_#ff2a47] lg:block"
          />

          <ol className="relative grid gap-12 lg:grid-cols-4 lg:gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.li
                  key={step.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ delay: i * 0.12, duration: 0.8, ease: EASE_OUT_EXPO }}
                  className="group relative flex gap-6 lg:flex-col"
                >
                  <div className="relative grid size-14 shrink-0 place-items-center">
                    <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" aria-hidden>
                      <path
                        d="M50 3 91 26.5v47L50 97 9 73.5v-47Z"
                        className="fill-ink-900 stroke-blood-500 transition-[fill] duration-500 group-hover:fill-blood-600"
                        strokeWidth="3"
                      />
                    </svg>
                    <Icon className="relative size-6 text-blood-400 transition-colors duration-500 group-hover:text-white" />
                  </div>
                  <div>
                    <span className="outline-text font-display text-7xl leading-none [-webkit-text-stroke-color:rgba(255,42,71,0.35)] transition-[-webkit-text-stroke-color] duration-500 group-hover:[-webkit-text-stroke-color:rgba(255,42,71,0.8)]">
                      0{i + 1}
                    </span>
                    <h3 className="mt-2 font-display text-4xl uppercase tracking-wide">
                      {step.title}
                    </h3>
                    <p className="mt-3 max-w-xs text-sm leading-relaxed text-bone-400">
                      {step.text}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
