import { seedSchoolAdmins, seedSchoolUsers } from "./seeders/seed-user";
import { seedSchools, seedSuperAdmin } from "./seeders/seed-school";
import { seedAssessmentQuestions } from "./seeders/seed-assessment-question";
import { seedGradesAndClassrooms } from "./seeders/seed-academic-structure";
import { TSeedConfig, TSeedCtx } from "@ctypes/seed.type";
import { seedAccessRequests } from "./seeders/seed-access-request";
import { PrismaClient, Role } from "@prisma/client";
import { seedAssignments } from "./seeders/seed-assignment";
import { cleanDb, envInt } from "@utils/seed-helper";
import { seedAuditLogs } from "./seeders/seed-audit";
import { seedSessions } from "./seeders/seed-session";
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
    gradesPerSchool: envInt("SEED_GRADES_PER_SCHOOL", 3),
    classroomsPerGrade: envInt("SEED_CLASSROOMS_PER_GRADE", 2),
    assignmentsPerSchool: envInt("SEED_ASSIGNMENTS_PER_SCHOOL", 3),
    assignmentParticipationRate: envInt(
      "SEED_ASSIGNMENT_PARTICIPATION_RATE",
      70,
    ),
  };

  faker.seed(cfg.seed);

  const ctx: TSeedCtx = { prisma, faker, cfg };

  await cleanDb(ctx);

  await seedSuperAdmin(ctx);

  const schools = await seedSchools(ctx);

  await seedAssessmentQuestions(ctx);

  const admins = await seedSchoolAdmins(ctx, schools);
  const users = await seedSchoolUsers(ctx, schools);

  const adminMap = Object.fromEntries(
    admins
      .filter((a) => a.role === Role.SCHOOL_ADMIN && a.schoolId)
      .map((a) => [a.schoolId!, { id: a.id }]),
  );

  const { gradesBySchool, classroomsBySchool } = await seedGradesAndClassrooms(
    ctx,
    schools,
    adminMap,
  );

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

  await seedAssignments(
    ctx,
    schools,
    adminMap,
    gradesBySchool,
    classroomsBySchool,
  );

  await seedSessions(
    ctx,
    users.map((u) => ({ id: u.id, schoolId: u.schoolId ?? null })),
  );

  if (cfg.includeOtps) {
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
