"use client";

import { fadeUpContainer, fadeUpItem } from "@/utils/motion";
import { Compass, ArrowRight } from "lucide-react";
import { homeStyles } from "@/utils/style";
import { useI18n } from "@/hooks/useI18n";
import { motion } from "framer-motion";
import { Button } from "@ui/button";
import { cn } from "@/lib/utils";

import Link from "next/link";

const HeroSection = () => {
  const { t, dir } = useI18n();
  const isRTL = dir === "rtl";

  return (
    <section className={homeStyles.heroRoot}>
      <div className={homeStyles.heroOverlay} />
      <div className={homeStyles.heroGlow1} />
      <div className={homeStyles.heroGlow2} />

      <div className={cn(homeStyles.container, homeStyles.heroContent)}>
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUpContainer(0.07, 0.03)}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.div variants={fadeUpItem(10)} className={homeStyles.pill}>
            <div className="h-10 w-10 rounded-2xl bg-white/15 flex items-center justify-center">
              <Compass className="h-5 w-5" />
            </div>
            <span className="font-semibold">Fanous</span>
          </motion.div>

          <motion.h1
            variants={fadeUpItem(12)}
            className={cn(homeStyles.heroTitle, "mt-7")}
          >
            {t("home.hero.title")}
          </motion.h1>

          <motion.p
            variants={fadeUpItem(12)}
            className={cn(homeStyles.heroDesc, "mt-5")}
          >
            {t("home.hero.desc")}
          </motion.p>

          <motion.div
            variants={fadeUpItem(12)}
            className={homeStyles.heroActions}
          >
            <Button
              asChild
              variant="brand"
              className="h-11 rounded-2xl px-6 font-semibold"
            >
              <Link href="/sign-in" className="gap-2">
                {t("home.hero.primaryCta")}
                <ArrowRight
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isRTL && "rotate-180",
                  )}
                />
              </Link>
            </Button>

            <Button
              asChild
              variant="soft"
              className="h-11 rounded-2xl px-6 font-semibold"
            >
              <Link href="/design-system">{t("home.hero.secondaryCta")}</Link>
            </Button>
          </motion.div>

          <motion.div
            variants={fadeUpItem(14)}
            className={homeStyles.heroStatsWrap}
          >
            {[
              { value: "500+", labelKey: "home.hero.stats.schools" },
              { value: "50K+", labelKey: "home.hero.stats.students" },
              { value: "95%", labelKey: "home.hero.stats.satisfaction" },
            ].map((s) => (
              <div key={s.labelKey} className={homeStyles.statCard}>
                <div className="text-2xl sm:text-3xl font-semibold">
                  {s.value}
                </div>
                <div className="text-xs sm:text-sm text-white/80 mt-1">
                  {t(s.labelKey)}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/70 to-transparent" />
    </section>
  );
};

export default HeroSection;
