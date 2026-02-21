import { MembershipStatus, OtpPurpose, SchoolRole } from "@prisma/client";
import { TSeedCtx } from "@ctypes/seed-types";
import { nanoid } from "nanoid";

import * as crypto from "crypto";

export const sha256 = (input: string): string =>
  crypto.createHash("sha256").update(input).digest("hex");

export const normalizeEmail = (email: string): string =>
  email.trim().toLowerCase();

export const normalizePhone = (phone: string): string =>
  phone.trim().replace(/\s|-/g, "");

export const uniqEmail = (ctx: TSeedCtx, prefix: string): string =>
  `${prefix}.${ctx.faker.string.alphanumeric(10).toLowerCase()}@example.com`;

export const uniqPhone = (ctx: TSeedCtx): string =>
  `09${ctx.faker.string.numeric(9)}`;

export const pickIdentifier = (
  ctx: TSeedCtx,
): {
  email?: string;
  phone?: string;
} => {
  const useEmail = ctx.faker.helpers.arrayElement([true, false]);
  return useEmail
    ? { email: uniqEmail(ctx, "user") }
    : { phone: uniqPhone(ctx) };
};

export const rolesPool = (): SchoolRole[] => {
  return [
    SchoolRole.STUDENT,
    SchoolRole.PARENT,
    SchoolRole.TEACHER,
    SchoolRole.COUNSELOR,
  ];
};

export const weightedMembershipStatus = (ctx: TSeedCtx): MembershipStatus => {
  const r = ctx.faker.number.int({ min: 1, max: 100 });
  if (r <= 45) return MembershipStatus.PENDING;
  if (r <= 80) return MembershipStatus.APPROVED;
  if (r <= 90) return MembershipStatus.REJECTED;
  return MembershipStatus.SUSPENDED;
};

export const maybeCorrectApprovedRole = (
  ctx: TSeedCtx,
  requested: SchoolRole,
): SchoolRole => {
  const correct = ctx.faker.number.int({ min: 1, max: 100 }) <= 20;
  if (!correct) return requested;
  const pool = rolesPool().filter((r) => r !== requested);
  return ctx.faker.helpers.arrayElement(pool);
};

export const nowPlusSeconds = (sec: number): Date =>
  new Date(Date.now() + sec * 1000);

export const otp6Digits = (ctx: TSeedCtx): string =>
  ctx.faker.string.numeric(6);

export const refreshExpiry = (days: number): Date =>
  new Date(Date.now() + days * 24 * 60 * 60 * 1000);

export const decideOtpPurposeForRole = (
  approvedRole: SchoolRole,
): OtpPurpose => {
  return approvedRole === SchoolRole.SCHOOL_ADMIN
    ? OtpPurpose.SCHOOL_ADMIN_LOGIN
    : OtpPurpose.USER_LOGIN;
};

export const generateRefreshToken = (): string => nanoid(64);
