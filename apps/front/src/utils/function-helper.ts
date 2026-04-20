import { TAuthIdentityPayload } from "@/types/constant";

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
