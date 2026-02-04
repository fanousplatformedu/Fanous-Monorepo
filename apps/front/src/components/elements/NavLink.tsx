"use client";

import { TNavLinksProps } from "@/types/elements";
import { navLinkStyles } from "@/utils/style";
import { cn } from "@/lib/utils";

import Link from "next/link";

export const NavLink = ({
  href,
  label,
  active,
  className,
  onClick,
}: TNavLinksProps) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        navLinkStyles.desktopBase,
        navLinkStyles.underline,
        active ? navLinkStyles.active : navLinkStyles.idle,
        className,
      )}
    >
      {label}
    </Link>
  );
};
