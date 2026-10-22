import SiteShell from "@/components/layout/SiteShell";
import CtaSection from "./CtaSection";
import FeaturesSection from "./FeaturesSection";
import HeroSection from "./HeroSection";
import HowItWorksSection from "./HowItWorksSection";

/** `/` — service introduction (design canvas "메인 페이지", web 1440 / mobile 390). */
export default function LandingPage() {
  return (
    <SiteShell>
      <main>
        <HeroSection />
        <HowItWorksSection />
        <FeaturesSection />
        <CtaSection />
      </main>
    </SiteShell>
  );
}
