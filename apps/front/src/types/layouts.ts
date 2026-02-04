import { TNavItem } from "./constant";

// =========== Header ===========
export type THMobileProps = {
  open: boolean;
  items: TNavItem[];
  onClose: () => void;
  t: (key: string) => string;
  isActive: (href: string) => boolean;
};

// =========== Footer ===========
export type TFooterLink = { href: string; labelKey: string };
export type TFooterCol = { titleKey: string; links: TFooterLink[] };
