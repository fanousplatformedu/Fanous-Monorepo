export type TLanguage = "en" | "fa";

export type I18nContextValue = {
  dir: "rtl" | "ltr";
  language: TLanguage;
  toggleLanguage: () => void;
  ta: (key: string) => string[];
  setLanguage: (lang: TLanguage) => void;
  t: (key: string, fallback?: string) => string;
};
