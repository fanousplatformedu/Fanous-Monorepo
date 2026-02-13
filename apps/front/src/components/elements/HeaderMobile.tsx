"use client";

import { THMobileProps } from "@/types/layouts";
import { headerStyles } from "@/utils/style";
import { Button } from "@ui/button";
import { cn } from "@/lib/utils";

import Link from "next/link";

export const HeaderMobileMenu = ({
  t,
  open,
  items,
  isActive,
  onClose,
}: THMobileProps) => {
  return (
    <div
      className={cn(
        headerStyles.mobilePanelWrap,
        open ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0",
      )}
    >
      <div className={headerStyles.mobilePanelInner}>
        <div className={headerStyles.mobileLinksWrap}>
          {items.map((item, idx) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onClose}
                style={{ transitionDelay: open ? `${idx * 70}ms` : "0ms" }}
                className={cn(
                  headerStyles.mobileLinkBase,
                  open
                    ? headerStyles.mobileLinkOpen
                    : headerStyles.mobileLinkClosed,
                  active
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted/70 text-muted-foreground hover:text-foreground",
                )}
              >
                {t(item.labelKey)}
              </Link>
            );
          })}

          <Button
            asChild
            variant="brand"
            className="mt-3 rounded-2xl font-semibold h-11"
            onClick={onClose}
            style={{
              transitionDelay: open ? `${items.length * 70 + 40}ms` : "0ms",
            }}
          >
            <Link href="/sign-in">{t("cta.getStarted")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
