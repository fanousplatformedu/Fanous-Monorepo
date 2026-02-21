import { TSeedEnv } from "@ctypes/seed-types";

export const envInt = (name: string, fallback: number): number => {
  const v = process.env[name];
  const n = v ? Number(v) : fallback;
  return Number.isFinite(n) ? n : fallback;
};

export const readSeedEnv = (): TSeedEnv => {
  return {
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL ?? "",
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD ?? "",
    SEED_SCHOOLS_COUNT: envInt("SEED_SCHOOLS_COUNT", 5),
    SEED_USERS_PER_SCHOOL: envInt("SEED_USERS_PER_SCHOOL", 25),
    SEED_MULTI_SCHOOL_USER_PERCENT: envInt(
      "SEED_MULTI_SCHOOL_USER_PERCENT",
      15,
    ),
    SEED_MULTI_SCHOOL_EXTRA_MIN: envInt("SEED_MULTI_SCHOOL_EXTRA_MIN", 1),
    SEED_MULTI_SCHOOL_EXTRA_MAX: envInt("SEED_MULTI_SCHOOL_EXTRA_MAX", 2),
    SEED_APPROVED_OTP_PERCENT: envInt("SEED_APPROVED_OTP_PERCENT", 70),
    SEED_APPROVED_SESSION_PERCENT: envInt("SEED_APPROVED_SESSION_PERCENT", 70),
    OTP_TTL_SECONDS: envInt("OTP_TTL_SECONDS", 120),
    OTP_RESEND_COOLDOWN_SECONDS: envInt("OTP_RESEND_COOLDOWN_SECONDS", 60),
    REFRESH_TOKEN_TTL_DAYS: envInt("REFRESH_TOKEN_TTL_DAYS", 30),
  };
};

export const requireEnvString = (name: string, value: string): string => {
  if (!value?.trim()) throw new Error(`Missing ${name} in env.`);
  return value.trim();
};
