import { GlobalRole, MembershipStatus } from "@prisma/client";
import { PrismaClient, SchoolRole } from "@prisma/client";
import { faker } from "@faker-js/faker";

import * as argon2 from "argon2";

const prisma = new PrismaClient();

function envInt(name: string, fallback: number) {
  const v = process.env[name];
  const n = v ? Number(v) : fallback;
  return Number.isFinite(n) ? n : fallback;
}

async function upsertSuperAdmin() {
  const email = process.env.SUPER_ADMIN_EMAIL!;
  const password = process.env.SUPER_ADMIN_PASSWORD!;
  if (!email || !password)
    throw new Error("Missing SUPER_ADMIN_EMAIL/SUPER_ADMIN_PASSWORD in env.");

  const passwordHash = await argon2.hash(password);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: {
        globalRole: GlobalRole.SUPER_ADMIN,
        passwordHash,
        isActive: true,
      },
    });
    return existing.id;
  }

  const created = await prisma.user.create({
    data: {
      email,
      passwordHash,
      globalRole: GlobalRole.SUPER_ADMIN,
      isActive: true,
    },
  });

  return created.id;
}

async function seedSchoolsAndUsers(superAdminId: string) {
  const schoolsCount = envInt("SEED_SCHOOLS_COUNT", 5);
  const usersPerSchool = envInt("SEED_USERS_PER_SCHOOL", 25);

  for (let i = 0; i < schoolsCount; i++) {
    const schoolCode = `SCH-${String(i + 1).padStart(3, "0")}`;
    const schoolName = `School ${i + 1} - ${faker.location.city()}`;

    const school = await prisma.school.upsert({
      where: { code: schoolCode },
      update: { name: schoolName, isActive: true },
      create: { code: schoolCode, name: schoolName, isActive: true },
    });

    // 1) Create a SCHOOL_ADMIN user for this school (created/managed by super admin later in app logic)
    const adminEmail = `admin.${schoolCode.toLowerCase()}@school.local`;
    const adminUser = await prisma.user.upsert({
      where: { email: adminEmail },
      update: { isActive: true },
      create: { email: adminEmail, isActive: true },
    });

    await prisma.userSchoolMembership.upsert({
      where: {
        userId_schoolId_role: {
          userId: adminUser.id,
          schoolId: school.id,
          role: SchoolRole.SCHOOL_ADMIN,
        },
      },
      update: {
        status: MembershipStatus.APPROVED,
        reviewedById: superAdminId,
        reviewedAt: new Date(),
        firstName: "School",
        lastName: "Admin",
      },
      create: {
        userId: adminUser.id,
        schoolId: school.id,
        role: SchoolRole.SCHOOL_ADMIN,
        status: MembershipStatus.APPROVED,
        reviewedById: superAdminId,
        reviewedAt: new Date(),
        firstName: "School",
        lastName: "Admin",
      },
    });

    // 2) Create normal users + memberships (some PENDING, some APPROVED)
    const rolesPool: SchoolRole[] = [
      SchoolRole.STUDENT,
      SchoolRole.PARENT,
      SchoolRole.TEACHER,
      SchoolRole.COUNSELOR,
    ];

    for (let j = 0; j < usersPerSchool; j++) {
      const role = faker.helpers.arrayElement(rolesPool);
      const status = faker.helpers.weightedArrayElement([
        { weight: 60, value: MembershipStatus.PENDING },
        { weight: 35, value: MembershipStatus.APPROVED },
        { weight: 5, value: MembershipStatus.REJECTED },
      ]);

      const email = faker.internet
        .email({ provider: "example.com" })
        .toLowerCase();
      const user = await prisma.user.create({
        data: { email, isActive: true },
      });

      await prisma.userSchoolMembership.create({
        data: {
          userId: user.id,
          schoolId: school.id,
          role,
          status,
          reviewedById:
            status === MembershipStatus.PENDING ? null : adminUser.id,
          reviewedAt: status === MembershipStatus.PENDING ? null : new Date(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          nationalId: faker.string.numeric(10),
          grade:
            role === SchoolRole.STUDENT
              ? faker.helpers.arrayElement(["7", "8", "9", "10", "11", "12"])
              : null,
        },
      });
    }
  }
}

async function main() {
  const superAdminId = await upsertSuperAdmin();
  await seedSchoolsAndUsers(superAdminId);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("✅ Seed completed");
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
