"use client";

import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { useId, useState } from "react";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { EASE_OUT_EXPO, Reveal } from "@/components/effects/reveal";
import { ButtonAnchor } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { faq, type FaqItem } from "@/data/faq";
import { cn } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";

function FaqRow({
  item,
  open,
  onToggle,
  index,
}: {
  item: FaqItem;
  open: boolean;
  onToggle: () => void;
  index: number;
}) {
  const id = useId();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.05, duration: 0.7, ease: EASE_OUT_EXPO }}
      className={cn(
        "overflow-hidden rounded-xl border transition-colors duration-300",
        open
          ? "border-blood-500/40 bg-blood-500/[0.06]"
          : "border-white/[0.07] bg-ink-850/70 hover:border-white/[0.14]",
      )}
    >
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-button`}
          onClick={onToggle}
          className="flex w-full items-center gap-4 px-5 py-5 text-left sm:px-6"
        >
          <span className="font-tech text-xs font-bold text-blood-500/70">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="flex-1 font-tech text-base font-semibold text-bone-50 sm:text-lg">
            {item.question}
          </span>
          <span
            className={cn(
              "grid size-8 shrink-0 place-items-center rounded-lg border transition-colors duration-300",
              open ? "border-blood-500 bg-blood-500 text-white" : "border-white/10 text-bone-400",
            )}
          >
            <motion.span
              animate={{ rotate: open ? 135 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="grid place-items-center"
            >
              <Plus className="size-4" />
            </motion.span>
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${id}-panel`}
            role="region"
            aria-labelledby={`${id}-button`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
          >
            <p className="px-5 pb-6 pl-[3.25rem] text-[15px] leading-relaxed text-bone-400 sm:px-6 sm:pl-[3.6rem]">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            align="left"
            eyebrow="Dúvidas"
            title="Perguntas"
            highlight="frequentes"
            description="Separamos as dúvidas mais comuns. Se a sua não estiver aqui, é só chamar."
          />
          <Reveal delay={0.2} className="mt-10">
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-linear-to-br from-blood-950/70 to-ink-900 p-6">
              <div aria-hidden className="absolute -right-10 -top-10 size-40 rounded-full bg-blood-600/30 blur-3xl" />
              <p className="relative font-display text-3xl uppercase tracking-wide">Ainda com dúvida?</p>
              <p className="relative mt-2 text-sm text-bone-400">
                Fala com a gente no WhatsApp, a resposta é rápida.
              </p>
              <ButtonAnchor
                href={whatsappLink("Olá, Freitas Modder! Tenho uma dúvida antes de comprar.")}
                target="_blank"
                rel="noopener noreferrer"
                className="relative mt-6"
              >
                <WhatsAppIcon size={18} />
                Chamar no WhatsApp
              </ButtonAnchor>
            </div>
          </Reveal>
        </div>

        <div className="flex flex-col gap-3">
          {faq.map((item, i) => (
            <FaqRow
              key={item.question}
              item={item}
              index={i}
              open={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
