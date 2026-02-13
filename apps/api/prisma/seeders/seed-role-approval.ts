import { PrismaClient, ApprovalStatus, Role } from "@prisma/client";
import { SeedUser } from "./seed-user";
import { faker } from "@faker-js/faker";

const allowedDesiredRoles: Role[] = [
  Role.STUDENT,
  Role.PARENT,
  Role.TEACHER,
  Role.COUNSELOR,
];

export const seedRoleApprovalRequests = async (
  prisma: PrismaClient,
  pendingUsers: SeedUser[],
) => {
  const pick = faker.helpers.arrayElements(pendingUsers, { min: 10, max: 15 });
  for (const u of pick) {
    const requestedRole = faker.helpers.arrayElement(allowedDesiredRoles);
    await prisma.roleApprovalRequest.create({
      data: {
        userId: u.id,
        requestedRole,
        schoolId: u.schoolId,
        status: ApprovalStatus.PENDING,
        note: faker.lorem.sentence(),
      },
    });
    await prisma.user.update({
      where: { id: u.id },
      data: { desiredRole: requestedRole },
    });
  }
};
