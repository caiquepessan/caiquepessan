import { Faq } from "@/components/sections/faq";
import { FeaturedAccounts } from "@/components/sections/featured-accounts";
import { FinalCta } from "@/components/sections/final-cta";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Services } from "@/components/sections/services";
import { Testimonials } from "@/components/sections/testimonials";
import { Ticker } from "@/components/sections/ticker";
import { WhyUs } from "@/components/sections/why-us";
import { siteConfig } from "@/config/site";
import { faq } from "@/data/faq";
import { products } from "@/data/products";

function JsonLd() {
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
          url: `${siteConfig.url}/contas/${p.slug}`,
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
      <Ticker />
      <FeaturedAccounts />
      <Services />
      <HowItWorks />
      <WhyUs />
      <Testimonials />
      <Faq />
      <FinalCta />
    </>
  );
}
