import { TStatusChartItem, TStudentRow, TTimelinePoint } from "@/types/modules";
import { TAuthIdentityPayload } from "@/types/constant";
import { TStudentDetailView } from "@/types/modules";
import { useI18n } from "@/hooks/useI18n";

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

// ============== School Admin Dashboard =================
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

// ============== Profile ===============
export const getInitials = (fullName?: string | null) => {
  if (!fullName?.trim()) return "P";
  const parts = fullName.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "P";
};

// ============== Counselor Dashboard ===============
const getValue = (obj: unknown, key: string): unknown => {
  if (!obj || typeof obj !== "object") return undefined;
  return (obj as Record<string, unknown>)[key];
};

export const getString = (value: unknown): string | null => {
  return typeof value === "string" ? value : null;
};

export const getRow = (item: unknown): TStudentRow => {
  const currentEnrollment =
    getValue(item, "currentEnrollment") ??
    (Array.isArray(getValue(item, "enrollments"))
      ? (getValue(item, "enrollments") as unknown[])[0]
      : null);
  const classroom = getValue(currentEnrollment, "classroom");
  const grade = getValue(classroom, "grade");
  return {
    id: getString(getValue(item, "id")) ?? "",
    fullName: getString(getValue(item, "fullName")),
    email: getString(getValue(item, "email")),
    mobile: getString(getValue(item, "mobile")),
    avatarUrl: getString(getValue(item, "avatarUrl")),
    status: getString(getValue(item, "status")),
    assignedAt:
      getString(getValue(item, "assignedAt")) ??
      getString(getValue(item, "createdAt")),
    gradeName: getString(getValue(grade, "name")),
    classroomName: getString(getValue(classroom, "name")),
  };
};

export const getDetail = (item: unknown): TStudentDetailView | null => {
  if (!item) return null;
  const currentEnrollment =
    getValue(item, "currentEnrollment") ??
    (Array.isArray(getValue(item, "enrollments"))
      ? (getValue(item, "enrollments") as unknown[])[0]
      : null);
  const classroom = getValue(currentEnrollment, "classroom");
  const grade = getValue(classroom, "grade");
  return {
    id: getString(getValue(item, "id")) ?? "",
    fullName: getString(getValue(item, "fullName")),
    email: getString(getValue(item, "email")),
    mobile: getString(getValue(item, "mobile")),
    avatarUrl: getString(getValue(item, "avatarUrl")),
    status: getString(getValue(item, "status")),
    gradeName: getString(getValue(grade, "name")),
    classroomName: getString(getValue(classroom, "name")),
    createdAt: getString(getValue(item, "createdAt")),
  };
};

export const getTimeline = (
  items: unknown[] | null | undefined,
): TTimelinePoint[] => {
  return (items ?? []).map((item) => ({
    label: getString(getValue(item, "label")) ?? "-",
    overall: Number(getValue(item, "overall") ?? 0),
  }));
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
