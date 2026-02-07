"use client";

import { fadeUpContainer, fadeUpItem } from "@/utils/motion";
import { homeStyles } from "@/utils/style";
import { useI18n } from "@/hooks/useI18n";
import { motion } from "framer-motion";
import { Button } from "@ui/button";
import { cn } from "@/lib/utils";

import Link from "next/link";

const CtaSection = () => {
  const { t } = useI18n();

  return (
    <section className={cn(homeStyles.sectionPad)}>
      <div className={homeStyles.container}>
        <motion.div
          initial="hidden"
          whileInView="show"
          className={homeStyles.ctaRoot}
          variants={fadeUpContainer(0.06)}
          viewport={{ once: true, amount: 0.25 }}
        >
          <div className={homeStyles.ctaGlow} />
          <div className={homeStyles.ctaInner}>
            <motion.h2
              variants={fadeUpItem()}
              className="text-2xl sm:text-3xl font-semibold tracking-tight"
            >
              {t("home.cta.title")}
            </motion.h2>

            <motion.p
              variants={fadeUpItem()}
              className="mt-3 text-white/90 max-w-2xl leading-7"
            >
              {t("home.cta.desc")}
            </motion.p>

            <motion.div
              variants={fadeUpItem()}
              className="mt-6 flex flex-col sm:flex-row gap-3"
            >
              <Button
                asChild
                variant="brand"
                className="h-11 rounded-2xl px-6 font-semibold"
              >
                <Link href="/auth/login">{t("home.cta.primary")}</Link>
              </Button>

              <Button
                asChild
                variant="soft"
                className="h-11 rounded-2xl px-6 font-semibold bg-white/12 text-white border border-white/20 hover:bg-white/16"
              >
                <Link href="/demo">{t("home.cta.secondary")}</Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
