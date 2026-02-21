import { seedMembershipsForSchools } from "./seeders/seed-membership";
import { TSeedCtx, TSeedResult } from "@ctypes/seed-types";
import { upsertSuperAdmin } from "./seeders/seed-superAdmin";
import { seedUsersPool } from "./seeders/seed-user";
import { PrismaClient } from "@prisma/client";
import { readSeedEnv } from "@utils/env";
import { seedSchools } from "./seeders/seed-schools";
import { faker } from "@faker-js/faker";

export const runSeed = async (): Promise<TSeedResult> => {
  const prisma = new PrismaClient();
  const env = readSeedEnv();

  const ctx: TSeedCtx = {
    prisma,
    faker,
    env,
    isProd: (process.env.NODE_ENV ?? "development") === "production",
  };

  try {
    const superAdminId = await upsertSuperAdmin(ctx);
    const schools = await seedSchools(ctx, superAdminId);
    const users = await seedUsersPool(ctx);
    await seedMembershipsForSchools(ctx, schools, users);
    return {
      superAdminId,
      schoolsCount: env.SEED_SCHOOLS_COUNT,
      usersPerSchool: env.SEED_USERS_PER_SCHOOL,
    };
  } finally {
    await prisma.$disconnect();
  }
};

runSeed()
  .then(() => console.log("✅ Seed completed:"))
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  });
