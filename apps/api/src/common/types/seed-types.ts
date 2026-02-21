import { faker as Faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

export type TSeedEnv = {
  OTP_TTL_SECONDS: number;
  SUPER_ADMIN_EMAIL: string;
  SEED_SCHOOLS_COUNT: number;
  SUPER_ADMIN_PASSWORD: string;
  SEED_USERS_PER_SCHOOL: number;
  REFRESH_TOKEN_TTL_DAYS: number;
  SEED_APPROVED_OTP_PERCENT: number;
  OTP_RESEND_COOLDOWN_SECONDS: number;
  SEED_MULTI_SCHOOL_EXTRA_MIN: number;
  SEED_MULTI_SCHOOL_EXTRA_MAX: number;
  SEED_APPROVED_SESSION_PERCENT: number;
  SEED_MULTI_SCHOOL_USER_PERCENT: number;
};

export type TSeedCtx = {
  env: TSeedEnv;
  isProd: boolean;
  prisma: PrismaClient;
  faker: typeof Faker;
};

export type TSeedSchool = {
  id: string;
  code: string;
  adminUserId: string;
};

export type TSeedUserSlim = {
  id: string;
  email: string | null;
  phone: string | null;
  emailNormalized: string | null;
  phoneNormalized: string | null;
};

export type TSeedResult = {
  superAdminId: string;
  schoolsCount: number;
  usersPerSchool: number;
};
