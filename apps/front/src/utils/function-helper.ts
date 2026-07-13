import { TStatusChartItem, TStudentRow, TTimelinePoint } from "@/types/modules";
import { TAuthIdentityPayload } from "@/types/constant";
import { I18nContextValue } from "@/types/providers";

import en from "@i18n/en.json";
import fa from "@i18n/fa.json";

// ============ Otp Request =============
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const mapEmailOrMobile = (value: string): TAuthIdentityPayload => {
  const normalized = value.trim();
  if (!normalized) return {};
  if (emailRegex.test(normalized.toLowerCase()))
    return { email: normalized.toLowerCase() };
  return { mobile: normalized };
};

// ============ Header ================
export const formatPersonName = (
  firstName?: string | null,
  lastName?: string | null,
  fallback = "",
): string => {
  const parts = [firstName?.trim(), lastName?.trim()].filter(Boolean);
  const name = parts.join(" ");
  return name || fallback;
};

export const getUserInitials = (
  firstName?: string | null,
  lastName?: string | null,
  email?: string | null,
) => {
  const first = firstName?.trim();
  const last = lastName?.trim();
  if (first && last) {
    return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
  }
  if (first) return first.slice(0, 1).toUpperCase();
  if (last) return last.slice(0, 1).toUpperCase();
  if (email) return email.slice(0, 1).toUpperCase();
  return "U";
};

// ============= Errors Messages ============
const formatErrorMessage = (value: unknown): string | null => {
  if (typeof value === "string" && value.trim()) return value;
  if (Array.isArray(value)) {
    const parts = value.filter(
      (item): item is string => typeof item === "string" && Boolean(item.trim()),
    );
    if (parts.length) return parts.join(", ");
  }
  return null;
};

const getOriginalErrorMessage = (error: unknown): string | null => {
  if (!error || typeof error !== "object") return null;
  const record = error as Record<string, unknown>;

  const directOriginal = record.originalError;
  if (directOriginal && typeof directOriginal === "object") {
    const message = formatErrorMessage(
      (directOriginal as Record<string, unknown>).message,
    );
    if (message) return message;
  }

  const data = record.data;
  if (data && typeof data === "object") {
    const errors = (data as Record<string, unknown>).errors;
    if (Array.isArray(errors)) {
      for (const item of errors) {
        if (!item || typeof item !== "object") continue;
        const extensions = (item as Record<string, unknown>).extensions;
        if (!extensions || typeof extensions !== "object") continue;
        const originalError = (extensions as Record<string, unknown>)
          .originalError;
        if (!originalError || typeof originalError !== "object") continue;
        const message = formatErrorMessage(
          (originalError as Record<string, unknown>).message,
        );
        if (message) return message;
      }
    }
  }

  return null;
};

export const getApiErrorMessage = (
  error: unknown,
  fallback = "Something went wrong",
) => {
  const originalMessage = getOriginalErrorMessage(error);
  if (originalMessage) return originalMessage;

  const directMessage = formatErrorMessage(error);
  if (directMessage) return directMessage;

  if (typeof error === "object" && error !== null) {
    const record = error as Record<string, unknown>;
    const data = record.data;
    if (data && typeof data === "object") {
      const dataMessage = formatErrorMessage(
        (data as Record<string, unknown>).message,
      );
      if (dataMessage) return dataMessage;
    }

    const topLevelMessage = formatErrorMessage(record.message);
    if (topLevelMessage) return topLevelMessage;
  }

  if (error instanceof Error && error.message.trim()) return error.message;
  return fallback;
};

// ============== Shared =================
export const generateRandomPassword = (length = 12): string => {
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  const all = lower + upper + digits;

  const pick = (chars: string) => {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return chars[array[0] % chars.length] ?? chars[0];
  };

  const passwordChars = [pick(lower), pick(upper), pick(digits)];
  while (passwordChars.length < length) {
    passwordChars.push(pick(all));
  }

  for (let i = passwordChars.length - 1; i > 0; i--) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const j = array[0] % (i + 1);
    [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
  }

  return passwordChars.join("");
};

const FUN_USERNAME_ADJECTIVES = [
  "happy",
  "sunny",
  "brave",
  "swift",
  "gentle",
  "clever",
  "cosmic",
  "bubbly",
  "merry",
  "lively",
  "golden",
  "cozy",
  "bold",
  "calm",
  "eager",
  "jolly",
  "kind",
  "nimble",
  "proud",
  "quiet",
  "royal",
  "snappy",
  "tidy",
  "vivid",
  "witty",
  "zesty",
  "bright",
  "cheery",
  "daring",
  "friendly",
] as const;

const FUN_USERNAME_NOUNS = [
  "panda",
  "tiger",
  "dolphin",
  "eagle",
  "fox",
  "owl",
  "bear",
  "koala",
  "rabbit",
  "turtle",
  "penguin",
  "falcon",
  "lion",
  "whale",
  "otter",
  "deer",
  "hawk",
  "wolf",
  "seal",
  "finch",
  "comet",
  "cloud",
  "star",
  "moon",
  "river",
  "spark",
  "rocket",
  "badge",
  "maple",
  "cactus",
] as const;

const pickRandomItem = <T,>(items: readonly T[]): T => {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return items[array[0] % items.length] ?? items[0];
};

export const generateFunUsername = (): string => {
  const adjective = pickRandomItem(FUN_USERNAME_ADJECTIVES);
  const noun = pickRandomItem(FUN_USERNAME_NOUNS);
  const suffixArray = new Uint32Array(1);
  crypto.getRandomValues(suffixArray);
  const suffix = (suffixArray[0] % 90) + 10;
  return `${adjective}-${noun}-${suffix}`;
};

export const toIsoFromLocalDateTime = (value?: string): string | undefined => {
  if (!value?.trim()) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
};

export const toLocalDateTimeInputValue = (value?: string | null): string => {
  if (!value?.trim()) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const formatShortDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

export const getInitials = (
  firstName?: string | null,
  lastName?: string | null,
) => {
  const name = formatPersonName(firstName, lastName);
  if (!name) return "P";
  const parts = name.split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "P";
};

// ============== Generic object helpers ===============
const getValue = (obj: unknown, key: string): unknown => {
  if (!obj || typeof obj !== "object") return undefined;
  return (obj as Record<string, unknown>)[key];
};

export const getString = (value: unknown): string | null => {
  return typeof value === "string" ? value : null;
};

export const getNullableString = (value: unknown): string | undefined =>
  typeof value === "string" ? value : undefined;

export const getBoolean = (value: unknown): boolean | undefined =>
  typeof value === "boolean" ? value : undefined;

export const getDateValue = (obj: unknown, keys: string[]): number => {
  if (!obj || typeof obj !== "object") return 0;
  for (const key of keys) {
    const value = (obj as Record<string, unknown>)[key];
    if (typeof value === "string") {
      const ts = new Date(value).getTime();
      if (!Number.isNaN(ts)) return ts;
    }
  }
  return 0;
};

export const getRecordValue = (obj: unknown, key: string): unknown => {
  if (!obj || typeof obj !== "object") return undefined;
  return (obj as Record<string, unknown>)[key];
};

// ============== Counselor helpers ===============
export const getRow = (item: unknown): TStudentRow => {
  const firstName = getString(getValue(item, "firstName"));
  const lastName = getString(getValue(item, "lastName"));
  return {
    id: getString(getValue(item, "id")) ?? "",
    firstName,
    lastName,
    assignedAt:
      getString(getValue(item, "assignedAt")) ??
      getString(getValue(item, "createdAt")) ??
      new Date(0).toISOString(),
    email: getString(getValue(item, "email")),
    mobile: getString(getValue(item, "mobile")),
    pendingReviews: Number(getValue(item, "pendingReviews") ?? 0),
    latestResultAt: getString(getValue(item, "latestResultAt")),
    upcomingSessionAt: getString(getValue(item, "upcomingSessionAt")),
    linkStatus:
      (getString(getValue(item, "linkStatus")) as TStudentRow["linkStatus"]) ??
      "ACTIVE",
  };
};

export const getTimeline = (
  items: unknown[] | null | undefined,
): TTimelinePoint[] => {
  return (items ?? []).map((item) => ({
    date: getString(getValue(item, "date")) ?? undefined,
    label: getString(getValue(item, "label")) ?? "-",
    value: Number(getValue(item, "value") ?? getValue(item, "overall") ?? 0),
  }));
};

export const getStatusDistribution = (
  items: unknown[],
  fieldName: string,
  labelPrefix: string,
  t: I18nContextValue["t"],
): TStatusChartItem[] => {
  const map = new Map<string, number>();
  for (const item of items) {
    const raw = getString(getRecordValue(item, fieldName)) || "UNKNOWN";
    map.set(raw, (map.get(raw) ?? 0) + 1);
  }
  return Array.from(map.entries()).map(([key, value]) => ({
    key,
    value,
    label:
      key === "UNKNOWN"
        ? t("dashboard.counselor.overview.common.notAvailable")
        : t(`${labelPrefix}.${key}`, {}, key),
  }));
};

// ================= i18 ==================
export const dictionaries = { en, fa } as const;

export type Dictionary = typeof en;
export type DictValue =
  | null
  | string
  | number
  | boolean
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
