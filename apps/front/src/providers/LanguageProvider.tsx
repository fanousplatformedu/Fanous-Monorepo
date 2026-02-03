"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { TLanguage, TLanguageCtx } from "@/types/providers";
import { Ctx } from "@/utils/constant";

const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<TLanguage>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem(
      "app_language",
    ) as TLanguage | null;
    if (saved === "en" || saved === "fa") setLanguageState(saved);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("app_language", language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "fa" ? "rtl" : "ltr";
  }, [language]);

  const value = useMemo<TLanguageCtx>(() => {
    return {
      language,
      setLanguage: (lang) => setLanguageState(lang),
      toggleLanguage: () => setLanguageState((p) => (p === "en" ? "fa" : "en")),
      dir: language === "fa" ? "rtl" : "ltr",
    };
  }, [language]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export default LanguageProvider;
