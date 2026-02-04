import { Github, Linkedin, Twitter, Youtube } from "lucide-react";
import { TNavItem, TSocialItem } from "@/types/constant";
import { createContext } from "react";
import { TLanguageCtx } from "@/types/providers";

// =========== Default Api ===========
export const DEFAULT_PAGE_SIZE = 12;
export const PAGE_SIZE_DEFAULT = 12;
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// =========== Poviders ===========
export const Ctx = createContext<TLanguageCtx | null>(null);

// =========== Nav =============
export const NAV_ITEMS: TNavItem[] = [
  { id: "home", href: "/", labelKey: "nav.home" },
  { id: "about", href: "/about", labelKey: "nav.about" },
  { id: "login", href: "/auth/login", labelKey: "nav.login" },
  { id: "contact", href: "/contact", labelKey: "nav.contact" },
];

export const SOCIALS: TSocialItem[] = [
  { icon: Twitter, label: "X", href: "https://x.com" },
  { icon: Github, label: "GitHub", href: "https://github.com" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
];
