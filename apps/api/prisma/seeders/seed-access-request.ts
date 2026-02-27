import { AccessRequestStatus, Role, UserStatus } from "@prisma/client";
import { TSeedCtx, TSeededSchool, TSeededUser } from "@ctypes/seed.type";
import { pick } from "@utils/seed-helper";

export const seedAccessRequests = (
  ctx: TSeedCtx,
  schools: TSeededSchool[],
  users: TSeededUser[],
) => {
  const { prisma, faker, cfg } = ctx;
  const roles: Role[] = [
    Role.STUDENT,
    Role.PARENT,
    Role.TEACHER,
    Role.COUNSELOR,
  ];
  const bySchoolUsers = new Map<string, TSeededUser[]>();
  for (const u of users) {
    if (!u.schoolId) continue;
    if (!bySchoolUsers.has(u.schoolId)) bySchoolUsers.set(u.schoolId, []);
    bySchoolUsers.get(u.schoolId)!.push(u);
  }
  const tasks: Array<ReturnType<typeof prisma.accessRequest.create>> = [];
  for (const school of schools) {
    const schoolUsers = bySchoolUsers.get(school.id) ?? [];
    for (let i = 0; i < cfg.requestsPerSchool; i++) {
      const requestedRole = pick(roles);
      const status = faker.helpers.weightedArrayElement<AccessRequestStatus>([
        { weight: 55, value: AccessRequestStatus.PENDING },
        { weight: 25, value: AccessRequestStatus.REJECTED },
        { weight: 20, value: AccessRequestStatus.APPROVED },
      ]);
      const useEmail = faker.datatype.boolean();
      const email = useEmail ? faker.internet.email().toLowerCase() : null;
      const mobile = !useEmail
        ? `+98${faker.string.numeric({ length: 10 })}`
        : null;
      let approvedUserId: string | null = null;
      if (status === AccessRequestStatus.APPROVED && schoolUsers.length > 0) {
        const candidate = pick(
          schoolUsers.filter((u) => u.status === UserStatus.ACTIVE),
        );
        approvedUserId = candidate?.id ?? null;
      }
      tasks.push(
        prisma.accessRequest.create({
          data: {
            schoolId: school.id,
            status,
            requestedRole,
            email,
            mobile,
            fullName: faker.person.fullName(),
            approvedUserId,
            reviewedAt:
              status === AccessRequestStatus.PENDING
                ? null
                : faker.date.recent(),
            rejectReason:
              status === AccessRequestStatus.REJECTED
                ? faker.lorem.sentence()
                : null,
          },
        }),
      );
    }
  }
  return Promise.all(tasks);
};
