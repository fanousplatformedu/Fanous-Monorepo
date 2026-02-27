import { randomBytes, createHash } from "crypto";
import { TSeedCtx, TSeededUser } from "@ctypes/seed.type";
import { SessionStatus } from "@prisma/client";

const sha256 = (x: string) => createHash("sha256").update(x).digest("hex");

export const seedSessions = async (ctx: TSeedCtx, users: TSeededUser[]) => {
  const { prisma, faker, cfg } = ctx;

  const tasks: Array<ReturnType<typeof prisma.authSession.create>> = [];

  for (const user of users) {
    for (let i = 0; i < cfg.sessionsPerUser; i++) {
      const sid = randomBytes(18).toString("hex");
      const refreshToken = randomBytes(32).toString("hex");

      tasks.push(
        prisma.authSession.create({
          data: {
            sid,
            userId: user.id,
            schoolId: user.schoolId,
            status: SessionStatus.ACTIVE,
            refreshTokenHash: sha256(refreshToken),
            ip: faker.internet.ipv4(),
            userAgent: faker.internet.userAgent(),
            expiresAt: faker.date.soon({ days: 20 }),
          },
        }),
      );
    }
  }

  return Promise.all(tasks);
};
