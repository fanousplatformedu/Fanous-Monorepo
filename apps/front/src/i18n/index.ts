import en from "./en.json";
import fa from "./fa.json";

export const dictionaries = {
  en,
  fa,
} as const;

export type Dictionary = typeof en;
type DictNode = string | { [key: string]: DictNode };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const getByKey = (obj: DictNode, key: string): string | undefined => {
  const parts = key.split(".");
  let current: DictNode = obj;
  for (const part of parts) {
    if (!isRecord(current)) return undefined;
    const next = current[part];
    if (next === undefined) return undefined;
    current = next as DictNode;
  }
  return typeof current === "string" ? current : undefined;
};
