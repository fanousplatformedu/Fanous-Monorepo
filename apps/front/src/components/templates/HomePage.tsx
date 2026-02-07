"use client";

import { DotBackground } from "@elements/DotBackground";
import { homeStyles } from "@/utils/style";
import { cn } from "@/lib/utils";

import FeaturesSection from "@modules/Home/Features";
import RolesSection from "@modules/Home/Roles";
import TrustSection from "@modules/Home/Trust";
import HeroSection from "@modules/Home/Hero";
import CtaSection from "@modules/Home/Cta";

const HomePage = () => {
  return (
    <main className={cn(homeStyles.page)}>
      <DotBackground />
      <HeroSection />
      <FeaturesSection />
      <RolesSection />
      <TrustSection />
      <CtaSection />
    </main>
  );
};

export default HomePage;
