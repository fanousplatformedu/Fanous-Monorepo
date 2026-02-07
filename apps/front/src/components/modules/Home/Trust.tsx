"use client";

import { fadeUpContainer, fadeUpItem } from "@/utils/motion";
import { homeStyles } from "@/utils/style";
import { HOME_TRUST } from "@/utils/constant";
import { useI18n } from "@/hooks/useI18n";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const TrustSection = () => {
  const { t } = useI18n();

  return (
    <section className={cn(homeStyles.sectionPad, "bg-muted/30")}>
      <div className={homeStyles.container}>
        <motion.div
          initial="hidden"
          whileInView="show"
          variants={fadeUpContainer(0.06)}
          viewport={{ once: true, amount: 0.25 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {HOME_TRUST.map((x) => {
            const Icon = x.icon;
            return (
              <motion.div
                key={x.titleKey}
                variants={fadeUpItem(12)}
                className={homeStyles.card}
              >
                <div className={homeStyles.cardGlow} />
                <div className="relative p-6 text-center">
                  <div className="mx-auto h-14 w-14 rounded-3xl bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="mt-4 font-semibold text-foreground">
                    {t(x.titleKey)}
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground leading-6">
                    {t(x.descKey)}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSection;
