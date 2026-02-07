import en from "./en.json";
import fa from "./fa.json";

export const dictionaries = { en, fa } as const;

export type Dictionary = typeof en;
export type DictValue =
  | string
  | number
  | boolean
  | null
  | DictObject
  | DictValue[];
export type DictObject = { [key: string]: DictValue };

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

export const getByKey = (obj: unknown, key: string): unknown => {
  const parts = key.split(".");
  let cur: unknown = obj;
  for (const part of parts) {
    if (!isObject(cur)) return undefined;
    cur = (cur as Record<string, unknown>)[part];
  }
  return cur;
};

export const isStringArray = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((x) => typeof x === "string");
