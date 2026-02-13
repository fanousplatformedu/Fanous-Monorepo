import { PrismaClient, OtpChannel } from "@prisma/client";
import { SeedUser } from "./seed-user";
import { faker } from "@faker-js/faker";
import { hash } from "argon2";

export const seedOtpTokens = async (
  prisma: PrismaClient,
  users: SeedUser[],
) => {
  const pick = faker.helpers.arrayElements(users, { min: 10, max: 15 });
  for (const u of pick) {
    const tenantId = u.schoolId ?? null;
    if (u.email) {
      const code = "111111";
      const codeHash = await hash(code);
      await prisma.otpToken.create({
        data: {
          codeHash,
          tenantId,
          verifiedAt: null,
          identifier: u.email,
          channel: OtpChannel.EMAIL,
          expiresAt: new Date(Date.now() + 120 * 1000),
        },
      });
    }

    if (u.phone) {
      const code = "222222";
      const codeHash = await hash(code);

      await prisma.otpToken.create({
        data: {
          codeHash,
          tenantId,
          verifiedAt: null,
          identifier: u.phone,
          channel: OtpChannel.PHONE,
          expiresAt: new Date(Date.now() + 120 * 1000),
        },
      });
    }
  }

  return { emailTestCode: "111111", phoneTestCode: "222222" };
};
