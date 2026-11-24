import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Cursor } from "@/components/effects/cursor";
import { Intro, IntroScript } from "@/components/effects/intro";
import { SmoothScroll } from "@/components/effects/smooth-scroll";
import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Providers } from "@/components/providers";
import { getCatalog } from "@/lib/catalog";
import { siteConfig } from "@/config/site";
import "./globals.css";

// Barlow foi desenhada a partir das placas de carro e sinalização
// da Califórnia, o que combina com o clima de GTA.
const barlow = Barlow({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-barlow",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  weight: ["700", "800"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [...siteConfig.keywords],
  category: "games",
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: { telephone: false },
  // Instalado na Tela de Início (iPhone): abre como app e recebe notificações
  appleWebApp: { capable: true, title: siteConfig.name, statusBarStyle: "black-translucent" },
  // Códigos de verificação do Google Search Console e do Bing (opcionais, pela Vercel)
  verification: {
    ...(process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : {}),
    ...(process.env.BING_SITE_VERIFICATION
      ? { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION } }
      : {}),
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: "/",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

export const viewport: Viewport = {
  themeColor: "#09090a",
  colorScheme: "dark",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Em cache: entra no HTML estático e só muda quando o painel salva.
  const catalog = await getCatalog();
  return (
    <html
      lang="pt-BR"
      className={`${barlow.variable} ${barlowCondensed.variable}`}
      // O script da abertura marca o <html> antes de o React hidratar.
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-ink-950 font-sans text-[#f5f4f2] antialiased">
        <IntroScript />
        <Intro />
        <div aria-hidden className="grain" />
        <Providers catalog={catalog}>
          <SmoothScroll />
          <a
            href="#conteudo"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-500 focus:px-4 focus:py-2 focus:text-white"
          >
            Pular para o conteúdo
          </a>
          <Navbar />
          <main id="conteudo" className="overflow-x-clip">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <FloatingWhatsApp />
          <Cursor />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
