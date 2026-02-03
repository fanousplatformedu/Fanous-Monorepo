"use client";

import { ReactNode } from "react";

import LanguageProvider from "./LanguageProvider";
import ThemeProvider from "./ThemePovider";

const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider>
      <LanguageProvider>{children}</LanguageProvider>
    </ThemeProvider>
  );
};

export default AppProviders;
