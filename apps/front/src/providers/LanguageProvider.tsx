"use client";

import { ReactNode, useEffect } from "react";
import { ensureI18n, AppLng } from "@/lib/i18n";

const LanguageProvider = ({
  children,
  initialLng,
}: {
  children: ReactNode;
  initialLng: AppLng;
}) => {
  useEffect(() => {
    ensureI18n(initialLng);
  }, [initialLng]);

  ensureI18n(initialLng);

  return <>{children}</>;
};

export default LanguageProvider;
