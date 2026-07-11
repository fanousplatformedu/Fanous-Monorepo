// Accepts international phone numbers: an optional leading "+" followed by
// 7-15 digits (per E.164). Common separators (spaces, dashes, dots,
// parentheses) are stripped before validation.
const PHONE_REGEX = /^\+?\d{7,15}$/;

export function normalizePhoneNumber(phone: string): string {
  return phone.trim().replace(/[\s\-().]/g, "");
}

export function isValidMobileNumber(phone?: string | null): boolean {
  if (!phone) return false;
  return PHONE_REGEX.test(normalizePhoneNumber(String(phone)));
}
