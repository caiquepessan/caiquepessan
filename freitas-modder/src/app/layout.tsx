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
  alternates: { canonical: "/" },
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
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#09090a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
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
        <Providers>
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
