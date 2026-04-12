export type TLanguage = "en" | "fa";

export type TParams = Record<string, string | number>;

export interface I18nContextValue {
  dir: "rtl" | "ltr";
  language: TLanguage;
  toggleLanguage: () => void;
  ta: (key: string) => string[];
  setLanguage: (lang: TLanguage) => void;
  t: (key: string, params?: TParams, fallback?: string) => string;
}
