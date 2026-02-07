"use client";

import { LanguageProvider } from "./LanguageProvider";
import { ThemeProvider } from "./ThemePovider";
import { ReactNode } from "react";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider>
      <LanguageProvider>{children}</LanguageProvider>
    </ThemeProvider>
  );
};
