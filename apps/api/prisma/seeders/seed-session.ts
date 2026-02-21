import { TokenType } from "@prisma/client";
import { TSeedCtx } from "@ctypes/seed-types";

import * as U from "@utils/seed-helper";

export const createRefreshSession = async (
  ctx: TSeedCtx,
  input: { schoolId: string; userId: string },
) => {
  const refreshToken = U.generateRefreshToken();
  const tokenHash = U.sha256(refreshToken);
  const session = await ctx.prisma.userSession.create({
    data: {
      userId: input.userId,
      schoolId: input.schoolId,
      tokenType: TokenType.REFRESH,
      tokenHash,
      expiresAt: U.refreshExpiry(ctx.env.REFRESH_TOKEN_TTL_DAYS),
      revokedAt: null,
      ip: ctx.faker.internet.ip(),
      userAgent: ctx.faker.internet.userAgent(),
    },
  });
  return { session, refreshToken };
};

export const createRefreshSessionIfNeeded = async (
  ctx: TSeedCtx,
  input: {
    schoolId: string;
    userId: string;
    chancePercent: number;
  },
) => {
  const makeSession =
    ctx.faker.number.int({ min: 1, max: 100 }) <= input.chancePercent;
  if (!makeSession) return;
  await createRefreshSession(ctx, {
    schoolId: input.schoolId,
    userId: input.userId,
  });
};
