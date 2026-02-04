import { LucideIcon } from "lucide-react";

// ============= Nav ===============
export type TNavItem = {
  href: string;
  labelKey: string;
  id: "home" | "login" | "about" | "contact";
};

export type TSocialItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};
