import { LandingPage, landingMetadata } from "@/components/seo/landing-page";

const SLUG = "up-de-level-gta-5";

export function generateMetadata() {
  return landingMetadata(SLUG);
}

export default function Page() {
  return <LandingPage slug={SLUG} />;
}
