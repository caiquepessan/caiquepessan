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
  title: "Freitas Modder | Contas modadas de GTA V para PS4 e PS5",
  description:
    "Contas modadas de GTA V para PS4 e PS5: dinheiro, nível alto, carros modificados e tudo desbloqueado. Pagamento no Pix e entrega pelo WhatsApp.",
  url: resolveSiteUrl(),
  locale: "pt_BR",
  keywords: [
    "conta modada gta 5 ps4",
    "conta modada gta 5 ps5",
    "dinheiro gta online ps5",
    "unlock all gta ps4",
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
    /** Tempo médio de entrega das contas prontas, em minutos. */
    avgDeliveryMinutes: 10,
  },
} as const;

export type SiteConfig = typeof siteConfig;
