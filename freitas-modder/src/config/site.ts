/**
 * ============================================================
 *  CONFIGURAÇÃO DA LOJA: edite aqui os dados do Freitas Modder
 * ============================================================
 *  Tudo que aparece no site (contato, redes, números, garantia)
 *  sai deste arquivo. Os valores abaixo são EXEMPLOS: troque pelos
 *  dados reais antes de publicar.
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
  title: "Freitas Modder | Contas modadas de GTA V",
  description:
    "Contas modadas de GTA V para PC, PlayStation e Xbox. Nível alto, bilhões em dinheiro, carros modificados e tudo desbloqueado. Entrega imediata, pagamento via PIX e garantia.",
  url: resolveSiteUrl(),
  locale: "pt_BR",
  keywords: [
    "contas modadas gta 5",
    "conta modada gta v",
    "gta 5 online conta",
    "dinheiro gta online",
    "unlock all gta",
    "freitas modder",
  ],

  contact: {
    /** Número no formato internacional, só dígitos (55 + DDD + número). */
    whatsappNumber: "5511999999999",
    whatsappDisplay: "(11) 99999-9999",
    email: "contato@freitasmodder.com.br",
    /** Links das redes. Deixe "" para esconder o ícone. */
    discord: "https://discord.gg/SEU-CONVITE",
    instagram: "https://instagram.com/freitasmodder",
    tiktok: "https://www.tiktok.com/@freitasmodder",
    youtube: "",
  },

  business: {
    warrantyDays: 30,
    supportHours: "Todos os dias, das 9h às 23h",
    avgDeliveryMinutes: 10,
    paymentMethods: ["PIX", "Cartão de crédito"],
  },

  /** Números exibidos no site. Use números reais da loja. */
  stats: {
    delivered: 5000,
    customers: 3200,
    rating: 4.9,
    reviews: 1200,
  },
} as const;

export type SiteConfig = typeof siteConfig;
