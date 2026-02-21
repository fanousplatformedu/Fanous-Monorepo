import { GlobalRole, SchoolRole } from "@prisma/client";
import { ExtractJwt } from "passport-jwt";
import { RoleValue } from "@decorators/roles.decorator";

// =============== Auth ===============
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
export const isPhone = (v: string) =>
  /^\+?\d{10,15}$/.test(v.replace(/\s/g, ""));

export const parseAccessTtlToSeconds = (ttl: string | undefined): number => {
  const v = (ttl ?? "15m").trim();
  const m = v.match(/^(\d+)(s|m|h|d)$/i);
  if (!m) return 15 * 60;
  const n = Number(m[1]);
  const unit = m[2].toLowerCase();
  if (unit === "s") return n;
  if (unit === "m") return n * 60;
  if (unit === "h") return n * 3600;
  return n * 86400;
};

// ========== Guards =============
export const isGlobalRole = (r: RoleValue): r is GlobalRole =>
  Object.values(GlobalRole).includes(r as GlobalRole);

export const isSchoolRole = (r: RoleValue): r is SchoolRole =>
  Object.values(SchoolRole).includes(r as SchoolRole);

// ========= Cookie Header ==========
export const cookieOrHeaderJwtExtractor = (req: any): string | null => {
  const headerToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
  if (headerToken) return headerToken;
  const sk = req?.cookies?.["sk_at"];
  if (sk) return sk;
  const sa = req?.cookies?.["sa_at"];
  if (sa) return sa;
  return null;
};
