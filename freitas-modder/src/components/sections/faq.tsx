"use client";

import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { useId, useState } from "react";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { EASE, Reveal } from "@/components/effects/reveal";
import { SplitWords } from "@/components/effects/split-words";
import { ButtonAnchor } from "@/components/ui/button";
import { faq, type FaqItem } from "@/data/faq";
import { whatsappLink } from "@/lib/whatsapp";

function FaqRow({
  item,
  open,
  onToggle,
}: {
  item: FaqItem;
  open: boolean;
  onToggle: () => void;
}) {
  const id = useId();

  return (
    <div className="border-b border-white/[0.08]">
      <h3>
        <button
          type="button"
          id={`${id}-q`}
          aria-expanded={open}
          aria-controls={`${id}-a`}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-6 py-5 text-left text-lg font-semibold transition-colors hover:text-white sm:py-6"
        >
          {item.question}
          <motion.span
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className={
              "grid size-8 shrink-0 place-items-center rounded-full transition-colors duration-200 " +
              (open ? "bg-brand-500 text-white" : "bg-white/[0.06] text-stone-300")
            }
          >
            <Plus className="size-4" />
          </motion.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${id}-a`}
            role="region"
            aria-labelledby={`${id}-q`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-6 text-[17px] leading-relaxed text-stone-400">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="duvidas" className="py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="font-display text-5xl font-extrabold uppercase leading-[0.9] sm:text-6xl lg:text-7xl">
            <SplitWords text="Dúvidas" />
          </h2>
          <p className="mt-4 max-w-sm text-lg leading-relaxed text-stone-400">
            Não achou sua pergunta aqui? Chama no WhatsApp que a gente responde.
          </p>
          <ButtonAnchor
            href={whatsappLink("Oi! Tenho uma dúvida antes de comprar.")}
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
            className="mt-6"
          >
            <WhatsAppIcon size={18} />
            Chamar no WhatsApp
          </ButtonAnchor>
        </Reveal>

        <Reveal delay={0.1} className="border-t border-white/[0.08]">
          {faq.map((item, i) => (
            <FaqRow
              key={item.question}
              item={item}
              open={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
            />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
