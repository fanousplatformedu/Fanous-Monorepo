import { TNavItem, TSocialItem } from "@/types/constant";
import { createContext } from "react";
import { TLanguage } from "@/types/providers";

import * as UiLucide from "lucide-react";

// =========== Default Api ===========
export const DEFAULT_PAGE_SIZE = 12;
export const PAGE_SIZE_DEFAULT = 12;
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// =========== Poviders ===========
export const Ctx = createContext<TLanguage | null>(null);

// =========== Nav =============
export const NAV_ITEMS: TNavItem[] = [
  { id: "home", href: "/", labelKey: "nav.home" },
  { id: "about", href: "/about", labelKey: "nav.about" },
  { id: "contact", href: "/contact", labelKey: "nav.contact" },
];

export const SOCIALS: TSocialItem[] = [
  { icon: UiLucide.Twitter, label: "X", href: "https://x.com" },
  { icon: UiLucide.Github, label: "GitHub", href: "https://github.com" },
  { icon: UiLucide.Youtube, label: "YouTube", href: "https://youtube.com" },
  { icon: UiLucide.Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
];

// ================ Home page ================
export const HOME_FEATURES = [
  {
    icon: UiLucide.BarChart3,
    titleKey: "home.features.items.assess.title",
    descKey: "home.features.items.assess.desc",
  },
  {
    icon: UiLucide.Compass,
    titleKey: "home.features.items.ai.title",
    descKey: "home.features.items.ai.desc",
  },
  {
    icon: UiLucide.Users,
    titleKey: "home.features.items.multi.title",
    descKey: "home.features.items.multi.desc",
  },
  {
    icon: UiLucide.BookOpen,
    titleKey: "home.features.items.reports.title",
    descKey: "home.features.items.reports.desc",
  },
] as const;

export const HOME_TRUST = [
  {
    icon: UiLucide.Shield,
    titleKey: "home.trust.security.title",
    descKey: "home.trust.security.desc",
  },
  {
    icon: UiLucide.Globe,
    titleKey: "home.trust.bilingual.title",
    descKey: "home.trust.bilingual.desc",
  },
  {
    icon: UiLucide.CheckCircle,
    titleKey: "home.trust.wcag.title",
    descKey: "home.trust.wcag.desc",
  },
] as const;

export const HOME_ROLES = [
  {
    colorClass: "bg-primary",
    titleKey: "home.roles.items.students.title",
    descKey: "home.roles.items.students.desc",
    bulletsKey: "home.roles.items.students.bullets",
  },
  {
    colorClass: "bg-emerald-500",
    titleKey: "home.roles.items.counselors.title",
    descKey: "home.roles.items.counselors.desc",
    bulletsKey: "home.roles.items.counselors.bullets",
  },
  {
    colorClass: "bg-amber-500",
    titleKey: "home.roles.items.admins.title",
    descKey: "home.roles.items.admins.desc",
    bulletsKey: "home.roles.items.admins.bullets",
  },
  {
    colorClass: "bg-indigo-500",
    titleKey: "home.roles.items.parents.title",
    descKey: "home.roles.items.parents.desc",
    bulletsKey: "home.roles.items.parents.bullets",
  },
  {
    colorClass: "bg-pink-500",
    titleKey: "home.roles.items.teachers.title",
    descKey: "home.roles.items.teachers.desc",
    bulletsKey: "home.roles.items.teachers.bullets",
  },
  {
    colorClass: "bg-violet-500",
    titleKey: "home.roles.items.super.title",
    descKey: "home.roles.items.super.desc",
    bulletsKey: "home.roles.items.super.bullets",
  },
] as const;

// ============= Auth =============

export const OTP_LENGTH = 6;
export const RESEND_SECONDS = 30;
