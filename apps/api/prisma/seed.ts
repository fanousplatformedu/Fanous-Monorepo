import { seedSchoolAdmins, seedSchoolUsers } from "./seeders/seed-user";
import { seedSchools, seedSuperAdmin } from "./seeders/seed-school";
import { TSeedConfig, TSeedCtx } from "@ctypes/seed.type";
import { seedAccessRequests } from "./seeders/seed-access-request";
import { cleanDb, envInt } from "@utils/seed-helper";
import { seedAuditLogs } from "./seeders/seed-audit";
import { seedSessions } from "./seeders/seed-session";
import { PrismaClient } from "@prisma/client";
import { seedOtps } from "./seeders/seed-otp";
import { faker } from "@faker-js/faker";

async function main() {
  if ((process.env.SEED_ENABLED ?? "true") !== "true") {
    console.log("Seed disabled (SEED_ENABLED!=true).");
    return;
  }
  const prisma = new PrismaClient();
  const cfg: TSeedConfig = {
    seed: envInt("SEED", 2026),
    schools: envInt("SEED_SCHOOLS", 4),
    adminsPerSchool: envInt("SEED_ADMINS_PER_SCHOOL", 1),
    usersPerSchool: envInt("SEED_USERS_PER_SCHOOL", 50),
    requestsPerSchool: envInt("SEED_REQUESTS_PER_SCHOOL", 20),
    sessionsPerUser: envInt("SEED_SESSIONS_PER_USER", 1),
    includeOtps: (process.env.SEED_INCLUDE_OTPS ?? "false") === "true",
    includeAudit: (process.env.SEED_INCLUDE_AUDIT ?? "true") === "true",
  };
  faker.seed(cfg.seed);
  const ctx: TSeedCtx = { prisma, faker, cfg };
  console.log("🧹 Cleaning DB...");
  await cleanDb(ctx);
  console.log("👑 Seeding SuperAdmin...");
  await seedSuperAdmin(ctx);
  console.log("🏫 Seeding Schools...");
  const schools = await seedSchools(ctx);
  console.log("🧑‍💼 Seeding School Admins...");
  await seedSchoolAdmins(
    ctx,
    schools.map((s) => ({ id: s.id, name: s.name, code: s.code })),
  );

  console.log("👥 Seeding School Users...");
  const users = await seedSchoolUsers(
    ctx,
    schools.map((s) => ({ id: s.id, name: s.name, code: s.code })),
  );

  console.log("📝 Seeding Access Requests...");
  await seedAccessRequests(
    ctx,
    schools.map((s) => ({ id: s.id, name: s.name })),
    users.map((u) => ({
      id: u.id,
      schoolId: u.schoolId!,
      email: u.email ?? null,
      mobile: u.mobile ?? null,
      role: u.role,
      status: u.status,
    })),
  );

  console.log("🔐 Seeding Sessions...");
  await seedSessions(
    ctx,
    users.map((u) => ({ id: u.id, schoolId: u.schoolId ?? null })),
  );

  if (cfg.includeOtps) {
    console.log("📲 Seeding OTPs...");
    await seedOtps(
      ctx,
      users.map((u) => ({
        id: u.id,
        schoolId: u.schoolId ?? null,
        email: u.email ?? null,
        mobile: u.mobile ?? null,
      })),
    );
  }

  if (cfg.includeAudit) {
    console.log("📜 Seeding Audit Logs...");
    await seedAuditLogs(
      ctx,
      schools.map((s) => ({ id: s.id, name: s.name, code: s.code })),
      users.map((u) => ({ id: u.id, schoolId: u.schoolId ?? null })),
    );
  }
  console.log("✅ Seed completed.");
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});
