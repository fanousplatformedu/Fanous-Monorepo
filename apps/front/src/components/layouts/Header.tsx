"use client";

import { useCurrentUserHeaderQuery } from "@/lib/redux/api";
import { Languages, Menu, X } from "lucide-react";
import { HeaderMobileMenu } from "@elements/header-mobile";
import { ThemeToggleBtn } from "@elements/theme-toggle-btn";
import { headerStyles } from "@/utils/style";
import { useScrolled } from "@/hooks/useScrolled";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/utils/constant";
import { useState } from "react";
import { UserMenu } from "@elements/user-menu";
import { useI18n } from "@/hooks/useI18n";
import { NavLink } from "@elements/nav-link";
import { Button } from "@ui/button";
import { Brand } from "@elements/Brand";
import { cn } from "@/lib/utils";

import Link from "next/link";

const Header = () => {
  const pathname = usePathname();
  const scrolled = useScrolled(10);
  const { toggleLanguage, t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: currentUser } = useCurrentUserHeaderQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

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
          <nav className="hidden items-center gap-1.5 lg:flex">
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
              variant="brandOutline"
              onClick={toggleLanguage}
              className="rounded-full"
              aria-label="Change language"
            >
              <Languages className="h-4.5 w-4.5" />
            </Button>
            <ThemeToggleBtn />
            {currentUser ? (
              <div className="hidden sm:block">
                <UserMenu />
              </div>
            ) : (
              <Button
                asChild
                variant="brand"
                className="hidden h-10 rounded-2xl px-5 font-semibold sm:inline-flex"
              >
                <Link href="/get-started">{t("cta.getStarted")}</Link>
              </Button>
            )}
            <Button
              size="icon"
              variant="ghost"
              className="lg:hidden"
              aria-label="Toggle menu"
              onClick={() => setMobileOpen((v) => !v)}
            >
              <span className="relative h-5 w-5">
                <Menu
                  className={cn(
                    "absolute inset-0 transition-all duration-300",
                    mobileOpen
                      ? "rotate-90 scale-75 opacity-0"
                      : "rotate-0 scale-100 opacity-100",
                  )}
                />
                <X
                  className={cn(
                    "absolute inset-0 transition-all duration-300",
                    mobileOpen
                      ? "rotate-0 scale-100 opacity-100"
                      : "-rotate-90 scale-75 opacity-0",
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
