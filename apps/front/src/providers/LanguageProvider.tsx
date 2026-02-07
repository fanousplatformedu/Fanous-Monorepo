"use client";

import { dictionaries, getByKey, isStringArray } from "@/i18n";
import { useMemo, useState, type ReactNode } from "react";
import { I18nContextValue, TLanguage } from "@/types/providers";
import { createContext, useEffect } from "react";

export const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "app_language";

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<TLanguage>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "fa") setLanguageState(saved);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "fa" ? "rtl" : "ltr";
  }, [language]);

  const value = useMemo<I18nContextValue>(() => {
    const dict = dictionaries[language];
    const t: I18nContextValue["t"] = (key, fallback = "") => {
      const v = getByKey(dict, key);
      return typeof v === "string" ? v : fallback;
    };
    const ta: I18nContextValue["ta"] = (key) => {
      const v = getByKey(dict, key);
      return isStringArray(v) ? v : [];
    };
    return {
      language,
      setLanguage: (lang) => setLanguageState(lang),
      toggleLanguage: () => setLanguageState((p) => (p === "en" ? "fa" : "en")),
      dir: language === "fa" ? "rtl" : "ltr",
      t,
      ta,
    };
  }, [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};
