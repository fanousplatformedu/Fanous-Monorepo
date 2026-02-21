import { GlobalRole, MembershipStatus, SchoolRole } from "@prisma/client";
import { TSeedCtx, TSeedSchool } from "@ctypes/seed-types";
import { normalizeEmail } from "@utils/seed-helper";

export const upsertSchool = async (
  ctx: TSeedCtx,
  input: { code: string; name: string },
) => {
  return ctx.prisma.school.upsert({
    where: { code: input.code },
    update: { name: input.name, isActive: true },
    create: { code: input.code, name: input.name, isActive: true },
    select: { id: true, code: true },
  });
};

export const upsertSchoolAdminForSchool = async (
  ctx: TSeedCtx,
  input: { schoolId: string; schoolCode: string; superAdminId: string },
) => {
  const adminEmail = `admin.${input.schoolCode}.${ctx.faker.string.alphanumeric(6).toLowerCase()}@school.local`;
  const adminEmailNormalized = normalizeEmail(adminEmail);
  const adminUser = await ctx.prisma.user.upsert({
    where: { emailNormalized: adminEmailNormalized },
    update: {
      email: adminEmail,
      emailNormalized: adminEmailNormalized,
      isActive: true,
      globalRole: GlobalRole.USER,
    },
    create: {
      email: adminEmail,
      emailNormalized: adminEmailNormalized,
      isActive: true,
      globalRole: GlobalRole.USER,
    },
    select: { id: true },
  });

  await ctx.prisma.userSchoolMembership.upsert({
    where: {
      userId_schoolId: { userId: adminUser.id, schoolId: input.schoolId },
    },
    update: {
      status: MembershipStatus.APPROVED,
      requestedRole: SchoolRole.SCHOOL_ADMIN,
      approvedRole: SchoolRole.SCHOOL_ADMIN,
      reviewedById: input.superAdminId,
      reviewedAt: new Date(),
      firstName: "School",
      lastName: "Admin",
      reviewNote: "Assigned by SUPER_ADMIN",
    },
    create: {
      userId: adminUser.id,
      schoolId: input.schoolId,
      status: MembershipStatus.APPROVED,
      requestedRole: SchoolRole.SCHOOL_ADMIN,
      approvedRole: SchoolRole.SCHOOL_ADMIN,
      reviewedById: input.superAdminId,
      reviewedAt: new Date(),
      firstName: "School",
      lastName: "Admin",
      reviewNote: "Assigned by SUPER_ADMIN",
    },
  });
  return adminUser.id;
};

export const seedSchools = async (
  ctx: TSeedCtx,
  superAdminId: string,
): Promise<TSeedSchool[]> => {
  const schools: TSeedSchool[] = [];
  for (let i = 0; i < ctx.env.SEED_SCHOOLS_COUNT; i++) {
    const code = `sch-${String(i + 1).padStart(3, "0")}`;
    const name = `School ${i + 1} - ${ctx.faker.location.city()}`;
    const school = await upsertSchool(ctx, { code, name });
    const adminUserId = await upsertSchoolAdminForSchool(ctx, {
      schoolId: school.id,
      schoolCode: code,
      superAdminId,
    });
    schools.push({ id: school.id, code, adminUserId });
  }
  return schools;
};
