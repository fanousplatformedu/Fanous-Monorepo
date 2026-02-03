export type TLanguage = "en" | "fa";

export type TLanguageCtx = {
  language: TLanguage;
  dir: "ltr" | "rtl";
  toggleLanguage: () => void;
  setLanguage: (lang: TLanguage) => void;
};
