"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { defaultWhatsappMessage, whatsappLink } from "@/lib/whatsapp";

/** Botão flutuante do WhatsApp (verde, como todo mundo reconhece). */
export function FloatingWhatsApp() {
  // Nos tickets e no painel o atendimento já está na tela (e o botão
  // ficaria por cima da caixa de resposta no celular).
  const pathname = usePathname();
  if (pathname.startsWith("/tickets") || pathname.startsWith("/painel")) return null;
  return (
    <motion.a
      href={whatsappLink(defaultWhatsappMessage)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chamar no WhatsApp"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.4 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      className="fab-whatsapp fixed bottom-5 right-5 z-[60] grid size-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_8px_24px_rgba(0,0,0,0.45)] sm:bottom-6 sm:right-6"
    >
      <WhatsAppIcon size={28} />
    </motion.a>
  );
}
