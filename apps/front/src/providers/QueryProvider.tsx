"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/lib/rtk/store";

export const QueryProvider = ({ children }: { children: ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};
