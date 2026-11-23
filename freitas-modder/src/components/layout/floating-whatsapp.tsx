"use client";

import { motion } from "motion/react";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { defaultWhatsappMessage, whatsappLink } from "@/lib/whatsapp";

/** Botão flutuante de WhatsApp com anéis pulsando. */
export function FloatingWhatsApp() {
  return (
    <motion.a
      href={whatsappLink(defaultWhatsappMessage)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a Freitas Modder no WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.6, type: "spring", stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className="fab-whatsapp group fixed bottom-5 right-5 z-[60] grid size-14 place-items-center rounded-full bg-linear-to-br from-blood-500 to-blood-700 text-white shadow-[0_10px_30px_-5px_rgba(255,42,71,0.7)] sm:bottom-7 sm:right-7"
    >
      <span aria-hidden className="absolute inset-0 animate-pulse-ring rounded-full border-2 border-blood-500" />
      <span
        aria-hidden
        className="absolute inset-0 animate-pulse-ring rounded-full border-2 border-blood-500 [animation-delay:1.1s]"
      />
      <WhatsAppIcon size={26} className="relative" />
      <span className="pointer-events-none absolute right-[calc(100%+12px)] hidden translate-x-2 whitespace-nowrap rounded-lg border border-white/10 bg-ink-800/95 px-3 py-2 font-tech text-xs font-semibold uppercase tracking-wider text-bone-100 opacity-0 shadow-xl backdrop-blur transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 sm:block">
        Fale com a gente
      </span>
    </motion.a>
  );
}
