import { Faq } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Money } from "@/components/sections/money";
import { Proofs } from "@/components/sections/proofs";
import { Services } from "@/components/sections/services";
import { Strip } from "@/components/sections/strip";
import { siteConfig } from "@/config/site";
import { faq } from "@/data/faq";
import { getCatalog } from "@/lib/catalog";

async function JsonLd() {
  const products = await getCatalog();
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Store",
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
      {
        "@type": "ItemList",
        itemListElement: products.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${siteConfig.url}/loja/${p.slug}`,
          name: p.name,
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export default function HomePage() {
  return (
    <>
      <JsonLd />
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
