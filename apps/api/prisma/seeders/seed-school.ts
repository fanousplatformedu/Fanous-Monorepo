import { Role, SchoolStatus, UserStatus } from "@prisma/client";
import { TSeedCtx } from "@ctypes/seed.type";
import { slugify } from "@utils/seed-helper";

import * as argon2 from "argon2";

export const seedSuperAdmin = async (ctx: TSeedCtx) => {
  const { prisma } = ctx;

  const email = (
    process.env.SUPER_ADMIN_EMAIL ?? "super@demo.com"
  ).toLowerCase();

  const username = process.env.SUPER_ADMIN_USERNAME ?? "superadmin";
  const password = process.env.SUPER_ADMIN_PASSWORD ?? "SuperPass123!";
  const passwordHash = await argon2.hash(password);

  const existing = await prisma.user.findFirst({
    where: { role: Role.SUPER_ADMIN },
    select: { id: true },
  });
  if (existing) return existing;
  return prisma.user.create({
    data: {
      role: Role.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      username,
      email,
      passwordHash,
      fullName: "System Super Admin",
      forcePasswordChange: false,
    },
    select: { id: true },
  });
};

export const seedSchools = async (ctx: TSeedCtx) => {
  const { prisma, faker, cfg } = ctx;
  const created: Array<{ id: string; name: string; code: string | null }> = [];
  for (let i = 0; i < cfg.schools; i++) {
    const name = `${faker.company.name()} School`;
    const baseCode = `${slugify(name)}-${faker.string.alphanumeric({ length: 4 }).toLowerCase()}`;
    const existing = await prisma.school.findFirst({
      where: { code: baseCode },
      select: { id: true, name: true, code: true },
    });
    if (existing) {
      created.push(existing);
      continue;
    }
    const school = await prisma.school.create({
      data: {
        name,
        code: baseCode,
        status: SchoolStatus.ACTIVE,
        settings: {
          timezone: "Asia/Tehran",
          locale: "fa-IR",
          academicYear:
            Number(process.env.SEED_ACADEMIC_YEAR ?? "1405") || 1405,
        },
      },
      select: {
        id: true,
        name: true,
        code: true,
      },
    });
    created.push(school);
  }
  return created;
};
