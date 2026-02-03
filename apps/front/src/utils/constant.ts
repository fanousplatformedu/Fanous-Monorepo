import { createContext } from "react";
import { TLanguageCtx } from "@/types/providers";

// =========== Default Api ===========
export const DEFAULT_PAGE_SIZE = 12;
export const PAGE_SIZE_DEFAULT = 12;
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// =========== Poviders ===========
export const Ctx = createContext<TLanguageCtx | null>(null);
