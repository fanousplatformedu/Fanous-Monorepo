import { OtpChannel, OtpPurpose, SchoolRole } from "@prisma/client";
import { TSeedCtx, TSeedUserSlim } from "@ctypes/seed-types";

import * as argon2 from "argon2";
import * as U from "@utils/seed-helper";

export const createOtpForApproved = async (
  ctx: TSeedCtx,
  input: {
    schoolId: string;
    user: TSeedUserSlim;
    purpose: OtpPurpose;
    markUsed: boolean;
  },
) => {
  let channel: OtpChannel;
  let email: string | null = null;
  let phone: string | null = null;
  let emailNormalized: string | null = null;
  let phoneNormalized: string | null = null;
  if (input.user.emailNormalized) {
    channel = OtpChannel.EMAIL;
    email = input.user.email;
    emailNormalized = input.user.emailNormalized;
  } else if (input.user.phoneNormalized) {
    channel = OtpChannel.SMS;
    phone = input.user.phone;
    phoneNormalized = input.user.phoneNormalized;
  } else {
    return null;
  }

  const code = U.otp6Digits(ctx);
  const codeHash = await argon2.hash(code);
  const expiresAt = U.nowPlusSeconds(ctx.env.OTP_TTL_SECONDS);
  const resendAfter = U.nowPlusSeconds(ctx.env.OTP_RESEND_COOLDOWN_SECONDS);
  const otp = await ctx.prisma.otpRequest.create({
    data: {
      schoolId: input.schoolId,
      userId: input.user.id,
      purpose: input.purpose,
      channel,
      email,
      phone,
      emailNormalized,
      phoneNormalized,
      codeHash,
      expiresAt,
      resendAfter,
      attempts: 0,
      usedAt: input.markUsed ? new Date() : null,
      ip: ctx.faker.internet.ip(),
      userAgent: ctx.faker.internet.userAgent(),
    },
  });
  return otp;
};

export const createOtpForApprovedIfNeeded = async (
  ctx: TSeedCtx,
  input: {
    schoolId: string;
    user: TSeedUserSlim;
    approvedRole: SchoolRole;
    chancePercent: number;
  },
) => {
  const makeOtp =
    ctx.faker.number.int({ min: 1, max: 100 }) <= input.chancePercent;
  if (!makeOtp) return;
  const markUsed = ctx.faker.number.int({ min: 1, max: 100 }) <= 40;
  const purpose = U.decideOtpPurposeForRole(input.approvedRole);
  await createOtpForApproved(ctx, {
    schoolId: input.schoolId,
    user: input.user,
    purpose,
    markUsed,
  });
};
