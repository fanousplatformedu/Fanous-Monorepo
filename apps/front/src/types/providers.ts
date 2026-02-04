export type TLanguage = "en" | "fa";

export type I18nContextValue = {
  dir: "rtl" | "ltr";
  language: TLanguage;
  toggleLanguage: () => void;
  t: (key: string) => string;
  setLanguage: (lang: TLanguage) => void;
};
