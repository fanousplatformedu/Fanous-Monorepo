import { useContext } from "react";
import { Ctx } from "./constant";

export const useLanguage = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
};
