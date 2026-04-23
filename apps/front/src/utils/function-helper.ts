import { TStatusChartItem, TStudentRow, TTimelinePoint } from "@/types/modules";
import { TAuthIdentityPayload } from "@/types/constant";
import { useI18n } from "@/hooks/useI18n";

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
export const getUserInitials = (
  fullName?: string | null,
  email?: string | null,
) => {
  const safeName = fullName?.trim();
  if (safeName) {
    const parts = safeName.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
  }
  if (email) return email.slice(0, 1).toUpperCase();
  return "U";
};

// ============= Errors Messages ============
export const getApiErrorMessage = (
  error: unknown,
  fallback = "Something went wrong",
) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof (error as { data?: { message?: string } }).data?.message === "string"
  ) {
    return (error as { data: { message?: string } }).data.message ?? fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
};

// ============== Shared =================
export const toIsoFromLocalDateTime = (value?: string): string | undefined => {
  if (!value?.trim()) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
};

export const formatShortDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

export const getInitials = (fullName?: string | null) => {
  if (!fullName?.trim()) return "P";
  const parts = fullName.trim().split(/\s+/).slice(0, 2);
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
  return {
    id: getString(getValue(item, "id")) ?? "",
    fullName: getString(getValue(item, "fullName")) ?? "-",
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
  t: ReturnType<typeof useI18n>["t"],
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
