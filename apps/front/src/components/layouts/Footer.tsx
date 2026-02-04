"use client";

import { Mail, MapPin, ArrowUpRight } from "lucide-react";
import { DotBackground } from "@elements/DotBackground";
import { footerStyles } from "@/utils/style";
import { SocialLinks } from "@elements/SocialLinks";
import { TFooterCol } from "@/types/layouts";
import { SOCIALS } from "@/utils/constant";
import { useMemo } from "react";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";
import { MOTION } from "@/utils/motion";
import { motion } from "framer-motion";
import { Brand } from "@elements/Brand";
import { cn } from "@/lib/utils";

import Link from "next/link";

const Footer = () => {
  const { t } = useI18n();

  const cols = useMemo<TFooterCol[]>(
    () => [
      {
        titleKey: "cols.product",
        links: [
          { href: "/", labelKey: "nav.home" },
          { href: "/about", labelKey: "nav.about" },
          { href: "/contact", labelKey: "nav.contact" },
          { href: "/auth/login", labelKey: "nav.login" },
        ],
      },
      {
        titleKey: "cols.resources",
        links: [
          { href: "/blog", labelKey: "links.blog" },
          { href: "/faq", labelKey: "links.faq" },
          { href: "/support", labelKey: "links.support" },
        ],
      },
      {
        titleKey: "cols.legal",
        links: [
          { href: "/privacy", labelKey: "links.privacy" },
          { href: "/terms", labelKey: "links.terms" },
        ],
      },
    ],
    [],
  );

  const containerVariants = MOTION.fadeUpStagger({
    y: 14,
    duration: 0.55,
    stagger: 0.06,
    delayChildren: 0.02,
  });

  const itemVariants = MOTION.fadeUpItem({ y: 10, duration: 0.45 });

  return (
    <footer className={footerStyles.root}>
      <div className={footerStyles.container}>
        <div className={footerStyles.topSeparator} />
      </div>
      <DotBackground />
      <motion.div
        initial="hidden"
        whileInView="show"
        variants={containerVariants}
        viewport={{ once: true, amount: 0.25 }}
        className={cn(footerStyles.container, footerStyles.contentPad)}
      >
        <div className={footerStyles.grid}>
          <motion.div variants={itemVariants} className={footerStyles.leftCol}>
            <Brand size="sm" />
            <p className={footerStyles.desc}>{t("footer.desc")}</p>
            <div className={footerStyles.contactWrap}>
              <motion.a
                variants={itemVariants}
                href="mailto:hello@fanous.ai"
                className={footerStyles.contactLink}
              >
                <Mail className="h-4 w-4" />
                hello@fanous.ai
                <ArrowUpRight className="h-3.5 w-3.5 opacity-70" />
              </motion.a>
              <motion.div
                variants={itemVariants}
                className={footerStyles.contactMeta}
              >
                <MapPin className="h-4 w-4" />
                {t("footer.location")}
              </motion.div>
            </div>
            <motion.div variants={itemVariants}>
              <SocialLinks items={SOCIALS} />
            </motion.div>
          </motion.div>
          <div className={footerStyles.rightCol}>
            <div className={footerStyles.linkCols}>
              {cols.map((col) => (
                <motion.div key={col.titleKey} variants={itemVariants}>
                  <div className="text-sm font-semibold text-foreground">
                    {t(col.titleKey)}
                  </div>

                  <ul className="mt-4 space-y-2.5">
                    {col.links.map((l) => (
                      <li key={l.href}>
                        <Link href={l.href} className={footerStyles.footerLink}>
                          {t(l.labelKey)}
                          <ArrowUpRight className={footerStyles.linkIcon} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
            <motion.div
              variants={itemVariants}
              className={footerStyles.newsletterCard}
            >
              <div className={footerStyles.newsletterRow}>
                <div>
                  <div className={footerStyles.newsletterTitle}>
                    {t("footer.newsletterTitle")}
                  </div>
                  <div className={footerStyles.newsletterDesc}>
                    {t("footer.newsletterDesc")}
                  </div>
                </div>

                <div className={footerStyles.newsletterForm}>
                  <input
                    type="email"
                    placeholder={t("footer.emailPlaceholder")}
                    className={footerStyles.newsletterInput}
                  />
                  <Button
                    variant="brand"
                    className={footerStyles.newsletterBtn}
                  >
                    {t("cta.join")}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <motion.div variants={itemVariants} className={footerStyles.bottomBar}>
          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Fanous. {t("footer.rights")}
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;
