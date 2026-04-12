"use client";

import { roleGatewayStyles, cardColors } from "@/utils/style";
import { FloatingParticles } from "@elements/floating-particles";
import { Background } from "@elements/background";
import { TRoleItem } from "@/types/modules";
import { useI18n } from "@/hooks/useI18n";
import { motion } from "framer-motion";
import { Button } from "@ui/button";

import Link from "next/link";

import * as L from "lucide-react";
import * as C from "@ui/card";

const items: TRoleItem[] = [
  {
    key: "superAdmin",
    href: "/auth/super-admin/login",
    icon: L.ShieldCheck,
    gradient: cardColors.superAdmin.gradient,
    iconColor: cardColors.superAdmin.iconColor,
    cardGradient: cardColors.superAdmin.cardGradient,
  },
  {
    key: "schoolAdmin",
    href: "/auth/school-admin/login",
    icon: L.School,
    gradient: cardColors.schoolAdmin.gradient,
    iconColor: cardColors.schoolAdmin.iconColor,
    cardGradient: cardColors.schoolAdmin.cardGradient,
  },
  {
    key: "schoolUser",
    href: "/auth/user/access-request",
    icon: L.UserRound,
    gradient: cardColors.schoolUser.gradient,
    iconColor: cardColors.schoolUser.iconColor,
    cardGradient: cardColors.schoolUser.cardGradient,
    secondaryHref: "/auth/user/otp",
    secondaryActionKey: "getStarted.roles.schoolUser.secondaryAction",
  },
];

const RoleGatewayPage = () => {
  const { t } = useI18n();
  return (
    <main className={roleGatewayStyles.mainContainer}>
      <Background />
      <section className={roleGatewayStyles.contentSection}>
        <div className={roleGatewayStyles.contentContainer}>
          <h1 className={roleGatewayStyles.title}>{t("getStarted.title")}</h1>
          <p className={roleGatewayStyles.description}>
            {t("getStarted.description")}
          </p>
        </div>
        <div className={roleGatewayStyles.cardsGrid}>
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={roleGatewayStyles.card.container}
              >
                <div
                  className={`${roleGatewayStyles.card.glow} ${item.gradient}`}
                />
                <div className={roleGatewayStyles.card.shadow} />
                <C.Card
                  className={`${roleGatewayStyles.card.base} ${item.cardGradient}`}
                >
                  <div className={roleGatewayStyles.card.pattern}>
                    <div className={roleGatewayStyles.card.radial} />
                  </div>
                  <C.CardHeader className={roleGatewayStyles.card.header}>
                    <div className={roleGatewayStyles.card.iconContainer}>
                      <div
                        className={`${roleGatewayStyles.card.iconWrapper} ${item.gradient}`}
                      >
                        <Icon
                          className={`${roleGatewayStyles.card.icon} ${item.iconColor}`}
                        />
                      </div>
                    </div>
                    <C.CardTitle className={roleGatewayStyles.card.title}>
                      {t(`getStarted.roles.${item.key}.title`)}
                    </C.CardTitle>
                    <C.CardDescription
                      className={roleGatewayStyles.card.description}
                    >
                      {t(`getStarted.roles.${item.key}.description`)}
                    </C.CardDescription>
                  </C.CardHeader>
                  <C.CardContent
                    className={roleGatewayStyles.card.buttonContainer}
                  >
                    <Button
                      asChild
                      className={roleGatewayStyles.card.button}
                      variant="brand"
                    >
                      <Link
                        href={item.href}
                        className={roleGatewayStyles.card.buttonLink}
                      >
                        <span>{t(`getStarted.roles.${item.key}.action`)}</span>
                        <L.ArrowRight
                          className={roleGatewayStyles.card.buttonIcon}
                        />
                      </Link>
                    </Button>

                    {item.secondaryHref && item.secondaryActionKey && (
                      <div
                        className={roleGatewayStyles.card.secondaryContainer}
                      >
                        <Link
                          href={item.secondaryHref}
                          className={roleGatewayStyles.card.secondaryLink}
                        >
                          <span
                            className={roleGatewayStyles.card.secondaryText}
                          >
                            {t(item.secondaryActionKey)}
                          </span>

                          <L.ArrowRight
                            className={roleGatewayStyles.card.secondaryIcon}
                          />
                        </Link>
                      </div>
                    )}
                  </C.CardContent>

                  <div className={roleGatewayStyles.card.line} />
                </C.Card>
              </motion.div>
            );
          })}
        </div>
        <div className={roleGatewayStyles.footerContainer}>
          <p className={roleGatewayStyles.footerText}>
            {t("getStarted.footer")}
          </p>
        </div>
      </section>
      <FloatingParticles />
    </main>
  );
};

export default RoleGatewayPage;
