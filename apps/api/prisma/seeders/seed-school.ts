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
  const tasks: Array<ReturnType<typeof prisma.school.create>> = [];
  for (let i = 0; i < cfg.schools; i++) {
    const name = `${faker.company.name()} School`;
    const code = `${slugify(name)}-${faker.string.alphanumeric({ length: 4 }).toLowerCase()}`;
    tasks.push(
      prisma.school.create({
        data: {
          name,
          code,
          status: SchoolStatus.ACTIVE,
          settings: { timezone: "Asia/Tehran", locale: "fa-IR" },
        },
      }),
    );
  }

  return Promise.all(tasks);
};
