/**
 * ============================================================
 *  CONFIGURAÇÃO DA LOJA: edite aqui os dados do Freitas Modder
 * ============================================================
 *  Contato, redes, garantia e horário que aparecem no site saem
 *  deste arquivo. WhatsApp e Instagram são os reais. O que estiver
 *  vazio ("") não aparece em lugar nenhum do site.
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
  title: "Freitas Modder | Dinheiro, level e Unlock All no GTA 5 Online (PS4 e PS5)",
  description:
    "Dinheiro, level e Unlock All com Corrida Modder no GTA 5 Online (PS4 e PS5), feito pelo Freitas direto na sua conta. Pix e acesso por QR Code, sem senha.",
  url: resolveSiteUrl(),
  locale: "pt_BR",
  keywords: [
    "dinheiro gta 5 online",
    "dinheiro gta 5 ps4",
    "dinheiro gta 5 ps5",
    "comprar dinheiro gta 5",
    "up de level gta 5",
    "unlock all gta 5",
    "unlock all gta 5 ps5",
    "corrida modder gta",
    "conta modada gta 5",
    "modder gta 5 ps4",
    "gta v online",
    "freitas modder",
  ],

  contact: {
    /** Número no formato internacional, só dígitos (55 + DDD + número). */
    whatsappNumber: "553190948425",
    whatsappDisplay: "(31) 9094-8425",
    /** E-mail de contato. Deixe "" para esconder. */
    email: "" as string,
    /** Links das redes. Deixe "" para esconder. */
    discord: "" as string,
    instagram: "https://instagram.com/freitasmodder",
    tiktok: "",
    youtube: "",
  },

  business: {
    warrantyDays: 30,
    /** Horário de atendimento (ex.: "Todo dia, das 9h às 23h"). Deixe "" para esconder. */
    supportHours: "" as string,
    /** Chave Pix que aparece na resposta pronta do painel. Deixe "" para escrever na hora. */
    pixKey: "" as string,
    /** Tempo médio de entrega, em minutos (hoje o site só diz "rápida"). */
    avgDeliveryMinutes: 10,
  },
} as const;

export type SiteConfig = typeof siteConfig;
