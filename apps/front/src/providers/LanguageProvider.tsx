"use client";

import { dictionaries, getByKey, isStringArray } from "@/utils/function-helper";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { I18nContextValue, TLanguage } from "@/types/providers";
import { createContext } from "react";

export const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "app_language";

const readSavedLanguage = (): TLanguage | null => {
  if (typeof window === "undefined") return null;
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved === "en" || saved === "fa" ? saved : null;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<TLanguage>("en");
  // Until storage has been read, don't persist the default ("en") over the
  // user's saved choice — otherwise remounts (e.g. router.refresh() on errors)
  // briefly clobber "fa" with "en" and the saved language is lost.
  const hydratedRef = useRef(false);

  useEffect(() => {
    const saved = readSavedLanguage();
    if (saved) setLanguageState(saved);
    hydratedRef.current = true;
  }, []);
  useEffect(() => {
    if (!hydratedRef.current) return;
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "fa" ? "rtl" : "ltr";
  }, [language]);
  const value = useMemo<I18nContextValue>(() => {
    const dict = dictionaries[language];
    const t: I18nContextValue["t"] = (key, params = {}, fallback = "") => {
      const value = getByKey(dict, key);
      if (typeof value !== "string") return fallback;
      let text: string = value;
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        text = text.replace(`{{${paramKey}}}`, String(paramValue));
      });
      return text;
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
