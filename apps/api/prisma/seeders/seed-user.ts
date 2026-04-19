import { TSeededSchool, TSeededSchoolUser } from "@ctypes/seed.type";
import { pick, randomPassword, slugify } from "@utils/seed-helper";
import { Prisma, Role, UserStatus } from "@prisma/client";
import { TSeedCtx, TSeededAdmin } from "@ctypes/seed.type";

import * as argon2 from "argon2";

export const seedSchoolAdmins = async (
  ctx: TSeedCtx,
  schools: TSeededSchool[],
) => {
  const { prisma, faker, cfg } = ctx;
  const tasks: Prisma.PrismaPromise<TSeededAdmin>[] = [];
  for (const school of schools) {
    for (let i = 0; i < cfg.adminsPerSchool; i++) {
      const usernameBase = slugify(school.code ?? school.name) || "school";
      const username = `${usernameBase}-${faker.string.alphanumeric({ length: 6 }).toLowerCase()}`;
      const tempPassword = randomPassword(12);
      const passwordHash = await argon2.hash(tempPassword);
      tasks.push(
        prisma.user.create({
          data: {
            role: Role.SCHOOL_ADMIN,
            status: UserStatus.ACTIVE,
            schoolId: school.id,
            username,
            passwordHash,
            email: faker.internet
              .email({ provider: "example.com" })
              .toLowerCase(),
            fullName: faker.person.fullName(),
            forcePasswordChange: true,
          },
          select: {
            id: true,
            schoolId: true,
            role: true,
            username: true,
            email: true,
          },
        }),
      );
    }
  }
  return Promise.all(tasks);
};

export const seedSchoolUsers = async (
  ctx: TSeedCtx,
  schools: TSeededSchool[],
) => {
  const { prisma, faker, cfg } = ctx;
  const roles: Role[] = [Role.STUDENT, Role.PARENT, Role.COUNSELOR];
  const tasks: Prisma.PrismaPromise<TSeededSchoolUser>[] = [];
  for (const school of schools) {
    for (let i = 0; i < cfg.usersPerSchool; i++) {
      const role = pick(roles);
      const status = faker.helpers.weightedArrayElement<UserStatus>([
        { weight: 92, value: UserStatus.ACTIVE },
        { weight: 6, value: UserStatus.DISABLED },
        { weight: 2, value: UserStatus.DELETED },
      ]);

      const email = faker.internet
        .email({ provider: "mail.com" })
        .toLowerCase();
      const mobile = `+98${faker.string.numeric({ length: 10 })}`;
      tasks.push(
        prisma.user.create({
          data: {
            schoolId: school.id,
            role,
            status,
            email,
            mobile,
            fullName: faker.person.fullName(),
            avatarUrl: faker.image.avatar(),
          },
          select: {
            id: true,
            role: true,
            schoolId: true,
            email: true,
            mobile: true,
            status: true,
          },
        }),
      );
    }
  }
  return Promise.all(tasks);
};
