"use client";

import { fadeUpContainer, fadeUpItem } from "@/utils/motion";
import { Users, CheckCircle2 } from "lucide-react";
import { HOME_ROLES } from "@/utils/constant";
import { homeStyles } from "@/utils/style";
import { useI18n } from "@/hooks/useI18n";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const RolesSection = () => {
  const { t, ta } = useI18n();

  return (
    <section className={cn(homeStyles.sectionPad)}>
      <div className={homeStyles.container}>
        <motion.div
          initial="hidden"
          whileInView="show"
          className="text-center"
          variants={fadeUpContainer(0.05)}
          viewport={{ once: true, amount: 0.25 }}
        >
          <motion.h2 variants={fadeUpItem()} className={homeStyles.h2}>
            {t("home.roles.title")}
          </motion.h2>

          <motion.p
            variants={fadeUpItem()}
            className={cn(homeStyles.p, "mt-3")}
          >
            {t("home.roles.desc")}
          </motion.p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
            {HOME_ROLES.map((r) => {
              const bullets = ta(r.bulletsKey);

              return (
                <motion.div
                  key={r.titleKey}
                  variants={fadeUpItem(12)}
                  className={homeStyles.card}
                >
                  <div className={homeStyles.cardGlow} />
                  <div className="relative p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "h-12 w-12 rounded-2xl flex items-center justify-center text-white",
                          r.colorClass,
                        )}
                      >
                        <Users className="h-5 w-5" />
                      </div>

                      <div>
                        <div className="font-semibold text-foreground">
                          {t(r.titleKey)}
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground leading-6">
                          {t(r.descKey)}
                        </div>
                      </div>
                    </div>

                    {bullets.length > 0 && (
                      <ul className="mt-5 space-y-2">
                        {bullets.map((b, i) => (
                          <li
                            key={`${r.bulletsKey}-${i}`}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
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

export default RolesSection;
