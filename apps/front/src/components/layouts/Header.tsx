"use client";

import { Languages, Menu, Moon, Sun, X } from "lucide-react";
import { HeaderMobileMenu } from "@elements/HeaderMobile";
import { headerStyles } from "@/utils/style";
import { useScrolled } from "@/hooks/useScrolled";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/utils/constant";
import { useTheme } from "next-themes";
import { useState } from "react";
import { NavLink } from "@elements/NavLink";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";
import { Brand } from "@elements/Brand";
import { cn } from "@/lib/utils";

const Header = () => {
  const pathname = usePathname();
  const scrolled = useScrolled(10);

  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const { toggleLanguage, t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        headerStyles.root,
        !scrolled && "bg-transparent shadow-none",
        scrolled && headerStyles.rootScrolled,
      )}
    >
      {scrolled && (
        <div aria-hidden="true" className={headerStyles.headerGradLayer} />
      )}

      <div className={headerStyles.container}>
        <div className={headerStyles.row}>
          <Brand />
          <nav className="hidden lg:flex items-center gap-1.5">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.id}
                href={item.href}
                label={t(item.labelKey)}
                active={isActive(item.href)}
              />
            ))}
          </nav>
          <div className={headerStyles.actions}>
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleLanguage}
              className="rounded-full"
              aria-label="Change language"
            >
              <Languages className="h-4.5 w-4.5" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="rounded-full"
              aria-label="Toggle theme"
              onClick={() => setTheme(isDark ? "light" : "dark")}
            >
              {isDark ? (
                <Sun className="h-4.5 w-4.5" />
              ) : (
                <Moon className="h-4.5 w-4.5" />
              )}
            </Button>

            <Button
              asChild
              variant="brand"
              className="hidden sm:inline-flex font-semibold rounded-2xl px-5 h-10"
            >
              <a href="/auth/login">{t("cta.getStarted")}</a>
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <span className="relative h-5 w-5">
                <Menu
                  className={cn(
                    "absolute inset-0 transition-all duration-300",
                    mobileOpen
                      ? "opacity-0 rotate-90 scale-75"
                      : "opacity-100 rotate-0 scale-100",
                  )}
                />
                <X
                  className={cn(
                    "absolute inset-0 transition-all duration-300",
                    mobileOpen
                      ? "opacity-100 rotate-0 scale-100"
                      : "opacity-0 -rotate-90 scale-75",
                  )}
                />
              </span>
            </Button>
          </div>
        </div>
      </div>
      <HeaderMobileMenu
        t={t}
        open={mobileOpen}
        items={NAV_ITEMS}
        isActive={isActive}
        onClose={() => setMobileOpen(false)}
      />
    </header>
  );
};

export default Header;
