import { landingFontVariables } from "../fonts";
import CtaSection from "./CtaSection";
import FeaturesSection from "./FeaturesSection";
import HeroSection from "./HeroSection";
import HowItWorksSection from "./HowItWorksSection";
import styles from "./LandingPage.module.css";
import MobileTabBar from "./MobileTabBar";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

/** `/` — service introduction (design canvas "메인 페이지", web 1440 / mobile 390). */
export default function LandingPage() {
  return (
    <div className={`${landingFontVariables} ${styles.root}`}>
      <SiteHeader currentPath="/" />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <FeaturesSection />
        <CtaSection />
      </main>
      <SiteFooter />
      <MobileTabBar currentPath="/" />
    </div>
  );
}
