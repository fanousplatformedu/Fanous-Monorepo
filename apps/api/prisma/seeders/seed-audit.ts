import { TSeedCtx, TSeededSchool, TSeededUser } from "@ctypes/seed.type";
import { AuditAction } from "@prisma/client";

export const seedAuditLogs = async (
  ctx: TSeedCtx,
  schools: TSeededSchool[],
  users: TSeededUser[],
) => {
  const { prisma, faker, cfg } = ctx;
  if (!cfg.includeAudit) return [];

  const tasks: Array<ReturnType<typeof prisma.auditLog.create>> = [];

  for (const s of schools) {
    const schoolUsers = users.filter((u) => u.schoolId === s.id);
    const actor = schoolUsers[0] ?? users[0];

    tasks.push(
      prisma.auditLog.create({
        data: {
          action: AuditAction.SCHOOL_CREATE,
          actorId: actor?.id ?? null,
          schoolId: s.id,
          entityType: "School",
          entityId: s.id,
          metadata: { seeded: true },
          ip: faker.internet.ipv4(),
          userAgent: faker.internet.userAgent(),
        },
      }),
    );
  }

  return Promise.all(tasks);
};
