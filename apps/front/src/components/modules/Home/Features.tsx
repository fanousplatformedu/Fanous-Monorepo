"use client";

import { fadeUpContainer, fadeUpItem } from "@/utils/motion";
import { HOME_FEATURES } from "@/utils/constant";
import { homeStyles } from "@/utils/style";
import { Sparkles } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const FeaturesSection = () => {
  const { t } = useI18n();

  return (
    <section className={cn(homeStyles.sectionPad)}>
      <div className={homeStyles.container}>
        <motion.div
          initial="hidden"
          whileInView="show"
          className="text-center"
          variants={fadeUpContainer(0.06)}
          viewport={{ once: true, amount: 0.25 }}
        >
          <motion.div variants={fadeUpItem()} className={homeStyles.badge}>
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">
              {t("home.features.badge")}
            </span>
          </motion.div>

          <motion.h2
            variants={fadeUpItem()}
            className={cn(homeStyles.h2, "mt-4")}
          >
            {t("home.features.title")}
          </motion.h2>

          <motion.p
            variants={fadeUpItem()}
            className={cn(homeStyles.p, "mt-3")}
          >
            {t("home.features.desc")}
          </motion.p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {HOME_FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.titleKey}
                  variants={fadeUpItem(12)}
                  className={homeStyles.card}
                >
                  <div className={homeStyles.cardGlow} />
                  <div className="relative p-6">
                    <div className={homeStyles.iconBox}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="mt-4 font-semibold text-foreground">
                      {t(f.titleKey)}
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground leading-6">
                      {t(f.descKey)}
                    </div>

                    <div
                      className={cn(
                        "mt-4 h-0.5 w-0 group-hover:w-20 transition-all duration-300 rounded-full",
                        "bg-[linear-gradient(135deg,rgba(59,130,246,1),rgba(147,197,253,1))]",
                        "dark:bg-[linear-gradient(135deg,rgba(214,170,110,1),rgba(241,230,214,1))]",
                      )}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
