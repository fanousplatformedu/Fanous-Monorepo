import { initReactI18next } from "react-i18next";

import i18n from "i18next";
import fr from "@lib/i18n/locales/fr.json";
import en from "@lib/i18n/locales/en.json";

export type AppLng = "en" | "fr";

export const resources = {
  en: {
    nav: en.nav,
    home: en.home,
    about: en.about,
    common: en.common,
    footer: en.footer,
    services: en.services,
  },
  fr: {
    nav: fr.nav,
    home: fr.home,
    about: fr.about,
    common: fr.common,
    footer: fr.footer,
    services: fr.services,
  },
};

let initialized = false;

export function ensureI18n(lng: AppLng) {
  if (!initialized) {
    i18n.use(initReactI18next).init({
      lng,
      resources,
      fallbackLng: "en",
      returnNull: false,
      defaultNS: "common",
      supportedLngs: ["en", "fr"],
      react: { useSuspense: false },
      interpolation: { escapeValue: false },
      ns: ["common", "home", "nav", "footer", "about"],
      debug: process.env.NEXT_PUBLIC_I18N_DEBUG === "1",
    });
    initialized = true;
  } else if (i18n.language !== lng) {
    i18n.changeLanguage(lng);
  }
  return i18n;
}
