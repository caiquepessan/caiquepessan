import { LandingPage, landingMetadata } from "@/components/seo/landing-page";

const SLUG = "dinheiro-gta-5-online";

export function generateMetadata() {
  return landingMetadata(SLUG);
}

export default function Page() {
  return <LandingPage slug={SLUG} />;
}
