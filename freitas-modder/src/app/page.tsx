import { Faq } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Money } from "@/components/sections/money";
import { Proofs } from "@/components/sections/proofs";
import { Services } from "@/components/sections/services";
import { Strip } from "@/components/sections/strip";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { faq } from "@/data/faq";
import { getCatalog } from "@/lib/catalog";
import { faqLd, graph, itemListLd, storeLd, websiteLd } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/** Loja, site, dúvidas e lista de produtos para o Google. */
async function HomeJsonLd() {
  const products = await getCatalog();
  return (
    <JsonLd
      data={graph(storeLd(), websiteLd(), faqLd(faq), itemListLd(products, `Preços do ${siteConfig.name}`))}
    />
  );
}

export default function HomePage() {
  return (
    <>
      <HomeJsonLd />
      <Hero />
      <Strip />
      <Money />
      <Services />
      <HowItWorks />
      <Proofs />
      <Faq />
      <FinalCta />
    </>
  );
}
