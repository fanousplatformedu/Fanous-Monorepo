"use client";

import { I18nContext } from "@/providers/LanguageProvider";
import { useContext } from "react";

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within LanguageProvider");
  return ctx;
};
