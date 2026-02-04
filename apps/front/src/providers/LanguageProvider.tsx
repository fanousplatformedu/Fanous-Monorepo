"use client";

import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { I18nContextValue, TLanguage } from "@/types/providers";
import { dictionaries, getByKey } from "@/i18n";
import { Dictionary } from "@/i18n";

export const I18nContext = createContext<I18nContextValue | null>(null);
const STORAGE_KEY = "app_language";

const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<TLanguage>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as TLanguage | null;
    if (saved === "en" || saved === "fa") setLanguageState(saved);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "fa" ? "rtl" : "ltr";
  }, [language]);

  const value = useMemo<I18nContextValue>(() => {
    const dict: Dictionary = dictionaries[language];

    return {
      language,
      dir: language === "fa" ? "rtl" : "ltr",
      setLanguage: (lang) => setLanguageState(lang),
      toggleLanguage: () => setLanguageState((p) => (p === "en" ? "fa" : "en")),
      t: (key: string) => {
        const v = getByKey(dict, key);
        return typeof v === "string" ? v : key;
      },
    };
  }, [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export default LanguageProvider;
