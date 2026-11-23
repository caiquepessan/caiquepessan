/**
 * ============================================================
 *  CONFIGURAÇÃO DA LOJA: edite aqui os dados do Freitas Modder
 * ============================================================
 *  Contato, redes, garantia e horário que aparecem no site saem
 *  deste arquivo. Os valores abaixo são EXEMPLOS: troque pelos
 *  dados reais antes de divulgar o site.
 */

function resolveSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}

export const siteConfig = {
  name: "Freitas Modder",
  title: "Freitas Modder | Dinheiro, level e Unlock All no GTA V para PS4 e PS5",
  description:
    "Dinheiro, up de level e Unlock All com Corrida Modder no GTA V Online para PS4 e PS5, direto no seu personagem. Pagamento no Pix e entrega rápida pelo WhatsApp.",
  url: resolveSiteUrl(),
  locale: "pt_BR",
  keywords: [
    "dinheiro gta 5 online ps4",
    "dinheiro gta 5 online ps5",
    "up de level gta 5",
    "unlock all gta ps5",
    "corrida modder gta",
    "conta modada gta 5",
    "freitas modder",
  ],

  contact: {
    /** Número no formato internacional, só dígitos (55 + DDD + número). */
    whatsappNumber: "5511999999999",
    whatsappDisplay: "(11) 99999-9999",
    email: "contato@freitasmodder.com.br",
    /** Links das redes. Deixe "" para esconder. */
    discord: "https://discord.gg/SEU-CONVITE",
    instagram: "https://instagram.com/freitasmodder",
    tiktok: "",
    youtube: "",
  },

  business: {
    warrantyDays: 30,
    supportHours: "Todo dia, das 9h às 23h",
    /** Tempo médio de entrega, em minutos (hoje o site só diz "rápida"). */
    avgDeliveryMinutes: 10,
  },
} as const;

export type SiteConfig = typeof siteConfig;
