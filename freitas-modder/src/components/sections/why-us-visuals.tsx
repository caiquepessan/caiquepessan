"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { EASE_OUT_EXPO } from "@/components/effects/reveal";

const logLines = [
  { text: "pedido #4821 recebido", status: "ok" },
  { text: "pagamento PIX confirmado", status: "ok" },
  { text: "preparando dados de acesso…", status: "run" },
  { text: "conta entregue em 4m32s", status: "done" },
] as const;

/** "Terminal" com o passo a passo de uma entrega. */
export function DeliveryLog() {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.45, delayChildren: 0.2 } } }}
      className="overflow-hidden rounded-xl border border-white/[0.08] bg-ink-950/80 font-mono text-[12px] sm:text-[13px]"
    >
      <div className="flex items-center gap-1.5 border-b border-white/[0.06] px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-blood-500" />
        <span className="size-2.5 rounded-full bg-ember-500/70" />
        <span className="size-2.5 rounded-full bg-bone-600/60" />
        <span className="ml-3 text-[11px] text-bone-600">entrega.log</span>
      </div>
      <ul className="space-y-2 p-4">
        {logLines.map((line) => (
          <motion.li
            key={line.text}
            variants={{
              hidden: { opacity: 0, x: -12 },
              show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE_OUT_EXPO } },
            }}
            className="flex items-center gap-3"
          >
            <span className="text-blood-500">❯</span>
            <span
              className={
                line.status === "done" ? "font-semibold text-emerald-300" : "text-bone-300"
              }
            >
              {line.text}
            </span>
            {line.status === "run" ? (
              <span className="ml-auto inline-block h-3.5 w-1.5 animate-blink bg-blood-500" />
            ) : (
              <Check
                className={
                  line.status === "done"
                    ? "ml-auto size-4 text-emerald-300"
                    : "ml-auto size-4 text-bone-500"
                }
              />
            )}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

const messages = [
  { from: "client", text: "Opa! A conta Pro serve pro PS5?" },
  { from: "store", text: "Serve sim! Te mando os dados assim que cair o PIX 🔥" },
  { from: "client", text: "Fechado, já paguei!" },
] as const;

/** Bolhas de conversa aparecendo uma a uma. */
export function ChatBubbles() {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.6, delayChildren: 0.2 } } }}
      className="flex flex-col gap-2"
    >
      {messages.map((m) => (
        <motion.p
          key={m.text}
          variants={{
            hidden: { opacity: 0, y: 12, scale: 0.92 },
            show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 20 } },
          }}
          className={
            m.from === "client"
              ? "max-w-[85%] self-end rounded-2xl rounded-br-md bg-blood-600 px-3.5 py-2 text-[13px] text-white"
              : "max-w-[85%] self-start rounded-2xl rounded-bl-md border border-white/10 bg-ink-700 px-3.5 py-2 text-[13px] text-bone-100"
          }
        >
          {m.text}
        </motion.p>
      ))}
    </motion.div>
  );
}

/** Mini "comprovante" de PIX sendo aprovado. */
export function PixApproved() {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
      className="rounded-xl border border-white/[0.08] bg-ink-950/70 p-4"
    >
      <div className="flex items-center justify-between text-xs text-bone-500">
        <span className="font-tech font-semibold uppercase tracking-[0.2em]">Pagamento</span>
        <motion.span
          variants={{ hidden: { opacity: 0, scale: 0.6 }, show: { opacity: 1, scale: 1, transition: { delay: 1.3, type: "spring", stiffness: 300, damping: 16 } } }}
          className="flex items-center gap-1 rounded-full bg-emerald-400/10 px-2 py-0.5 font-tech text-[10px] font-semibold uppercase tracking-wider text-emerald-300"
        >
          <Check className="size-3" /> Aprovado
        </motion.span>
      </div>
      <p className="mt-2 font-display text-3xl leading-none tracking-wide">R$ 79,90</p>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { delay: 0.2, duration: 1.1, ease: EASE_OUT_EXPO } } }}
          className="h-full origin-left rounded-full bg-linear-to-r from-blood-600 to-emerald-400"
        />
      </div>
    </motion.div>
  );
}
