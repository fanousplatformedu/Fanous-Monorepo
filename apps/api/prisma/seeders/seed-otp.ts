import { OtpChannel, OtpPurpose } from "@prisma/client";
import { TSeedCtx, TSeededUser } from "@ctypes/seed.type";

import * as argon2 from "argon2";

export const seedOtps = async (ctx: TSeedCtx, users: TSeededUser[]) => {
  const { prisma, cfg } = ctx;
  if (!cfg.includeOtps) return [];
  const tasks: Array<ReturnType<typeof prisma.otpCode.create>> = [];
  for (const u of users) {
    if (!u.schoolId) continue;
    const destination = u.email ?? u.mobile;
    if (!destination) continue;
    const channel = u.email ? OtpChannel.EMAIL : OtpChannel.SMS;
    const code = "123456";
    const codeHash = await argon2.hash(code);
    tasks.push(
      prisma.otpCode.create({
        data: {
          schoolId: u.schoolId,
          userId: u.id,
          channel,
          purpose: OtpPurpose.LOGIN,
          destination,
          codeHash,
          expiresAt: new Date(Date.now() + 2 * 60 * 1000),
          resendAfter: new Date(Date.now() + 60 * 1000),
          maxAttempts: 5,
        },
      }),
    );
  }

  return Promise.all(tasks);
};
