import { requireEnvString } from "@utils/env";
import { normalizeEmail } from "@utils/seed-helper";
import { GlobalRole } from "@prisma/client";
import { TSeedCtx } from "@ctypes/seed-types";

import * as argon2 from "argon2";

export const upsertSuperAdmin = async (ctx: TSeedCtx): Promise<string> => {
  const email = requireEnvString(
    "SUPER_ADMIN_EMAIL",
    ctx.env.SUPER_ADMIN_EMAIL,
  );
  const password = requireEnvString(
    "SUPER_ADMIN_PASSWORD",
    ctx.env.SUPER_ADMIN_PASSWORD,
  );
  const emailNormalized = normalizeEmail(email);
  const passwordHash = await argon2.hash(password);
  const existing = await ctx.prisma.user.findUnique({
    where: { emailNormalized },
    select: { id: true },
  });
  if (existing) {
    await ctx.prisma.user.update({
      where: { id: existing.id },
      data: {
        email,
        emailNormalized,
        globalRole: GlobalRole.SUPER_ADMIN,
        passwordHash,
        isActive: true,
      },
    });
    return existing.id;
  }

  const created = await ctx.prisma.user.create({
    data: {
      email,
      emailNormalized,
      passwordHash,
      globalRole: GlobalRole.SUPER_ADMIN,
      isActive: true,
    },
    select: { id: true },
  });

  return created.id;
};
