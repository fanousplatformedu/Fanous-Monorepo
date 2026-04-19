import { TSeedCtx, TSeededSchool, TSeededUser } from "@ctypes/seed.type";
import { AccessRequestRole, UserStatus } from "@prisma/client";
import { AccessRequestStatus } from "@prisma/client";
import { pick } from "@utils/seed-helper";

export const seedAccessRequests = async (
  ctx: TSeedCtx,
  schools: TSeededSchool[],
  users: TSeededUser[],
) => {
  const { prisma, faker, cfg } = ctx;

  const roles: AccessRequestRole[] = [
    AccessRequestRole.STUDENT,
    AccessRequestRole.PARENT,
    AccessRequestRole.COUNSELOR,
  ];

  const bySchoolUsers = new Map<string, TSeededUser[]>();

  for (const user of users) {
    if (!user.schoolId) continue;
    const current = bySchoolUsers.get(user.schoolId) ?? [];
    current.push(user);
    bySchoolUsers.set(user.schoolId, current);
  }

  const tasks: Array<ReturnType<typeof prisma.accessRequest.create>> = [];

  for (const school of schools) {
    const schoolUsers = bySchoolUsers.get(school.id) ?? [];
    const activeSchoolUsers = schoolUsers.filter(
      (user) => user.status === UserStatus.ACTIVE,
    );
    for (let index = 0; index < cfg.requestsPerSchool; index++) {
      const requestedRole = pick(roles);
      const status = faker.helpers.weightedArrayElement<AccessRequestStatus>([
        { weight: 55, value: AccessRequestStatus.PENDING },
        { weight: 25, value: AccessRequestStatus.REJECTED },
        { weight: 20, value: AccessRequestStatus.APPROVED },
      ]);
      const useEmail = faker.datatype.boolean();
      const email = useEmail ? faker.internet.email().toLowerCase() : null;
      const mobile = useEmail
        ? null
        : `+98${faker.string.numeric({ length: 10 })}`;
      let approvedUserId: string | null = null;
      if (status === AccessRequestStatus.APPROVED && activeSchoolUsers.length) {
        const approvedUser = pick(activeSchoolUsers);
        approvedUserId = approvedUser?.id ?? null;
      }
      const reviewedAt =
        status === AccessRequestStatus.PENDING ? null : faker.date.recent();
      const rejectReason =
        status === AccessRequestStatus.REJECTED ? faker.lorem.sentence() : null;
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
            reviewedAt,
            rejectReason,
          },
        }),
      );
    }
  }
  return Promise.all(tasks);
};
