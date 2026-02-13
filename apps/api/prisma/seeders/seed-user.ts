import { PrismaClient, Role } from "@prisma/client";
import { SeedSchool } from "./seed-school";
import { faker } from "@faker-js/faker";
import { hash } from "argon2";

export type SeedUser = {
  id: string;
  role: Role;
  email: string | null;
  phone: string | null;
  schoolId: string | null;
};

const allowedDesiredRoles: Role[] = [
  Role.STUDENT,
  Role.PARENT,
  Role.TEACHER,
  Role.COUNSELOR,
];

const iranPhone = () =>
  `+98${faker.number.int({ min: 9000000000, max: 9999999999 })}`;

export const seedUsers = async (
  prisma: PrismaClient,
  schools: SeedSchool[],
) => {
  await prisma.refreshToken.deleteMany({});
  await prisma.otpToken.deleteMany({});
  await prisma.roleApprovalRequest.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.school.deleteMany({});
  const freshSchools: SeedSchool[] = [];
  for (const s of schools) {
    const created = await prisma.school.create({
      data: { name: s.name, slug: s.slug, isActive: true },
      select: { id: true, name: true, slug: true },
    });
    freshSchools.push(created);
  }

  const superAdminEmail = "superadmin@fanous.local";
  const superAdminPass = await hash("SuperAdmin1234!");
  const superAdmin = await prisma.user.create({
    data: {
      role: Role.SUPER_ADMIN,
      email: superAdminEmail,
      emailVerified: true,
      password: superAdminPass,
      name: "Super Admin",
      isActive: true,
    },
    select: { id: true, email: true, phone: true, schoolId: true, role: true },
  });

  const schoolAdmins: SeedUser[] = [];

  for (const school of freshSchools) {
    const email = `admin.${school.slug}@fanous.local`;
    const pass = await hash("Admin1234!");
    const admin = await prisma.user.create({
      data: {
        email,
        password: pass,
        isActive: true,
        role: Role.ADMIN,
        emailVerified: true,
        schoolId: school.id,
        name: `Admin of ${school.name}`,
      },
      select: {
        id: true,
        role: true,
        email: true,
        phone: true,
        schoolId: true,
      },
    });

    schoolAdmins.push(admin);
  }

  const usersCount = 30;
  const users: SeedUser[] = [];

  for (let i = 0; i < usersCount; i++) {
    const school = faker.helpers.arrayElement(freshSchools);
    const hasEmail = faker.datatype.boolean();
    const hasPhone = !hasEmail || faker.datatype.boolean();
    const email = hasEmail ? faker.internet.email().toLowerCase() : null;
    const phone = hasPhone ? iranPhone() : null;
    const desiredRole = faker.helpers.arrayElement(allowedDesiredRoles);

    const created = await prisma.user.create({
      data: {
        email,
        phone,
        desiredRole,
        password: null,
        isActive: true,
        role: Role.PENDING,
        schoolId: school.id,
        emailVerified: false,
        phoneVerified: false,
        bio: faker.lorem.paragraph(),
        avatar: faker.image.avatar(),
        name: faker.person.fullName(),
        website: faker.internet.url(),
        location: faker.location.city(),
        occupation: faker.person.jobTitle(),
        joinDate: faker.date.past({ years: 2 }),
        learningHours: faker.number.int({ min: 0, max: 2000 }),
        coursesEnrolled: faker.number.int({ min: 0, max: 50 }),
        certificatesEarned: faker.number.int({ min: 0, max: 20 }),
        education: faker.helpers.arrayElement(["Diploma", "BSc", "MSc", "PhD"]),
      },
      select: {
        id: true,
        email: true,
        phone: true,
        schoolId: true,
        role: true,
      },
    });

    users.push(created);
  }

  const approvedCount = 6;
  const approvedUsers: SeedUser[] = [];

  for (let i = 0; i < approvedCount; i++) {
    const school = faker.helpers.arrayElement(freshSchools);
    const desiredRole = faker.helpers.arrayElement(allowedDesiredRoles);
    const email = faker.internet.email().toLowerCase();
    const approver = faker.helpers.arrayElement(schoolAdmins);
    const created = await prisma.user.create({
      data: {
        schoolId: school.id,
        role: desiredRole,
        desiredRole,
        roleApprovedAt: new Date(),
        roleApprovedById: approver.id,
        name: faker.person.fullName(),
        email,
        emailVerified: true,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        phone: true,
        schoolId: true,
        role: true,
      },
    });
    approvedUsers.push(created);
  }

  return {
    schools: freshSchools,
    superAdmin,
    schoolAdmins,
    users,
    approvedUsers,
    passwords: {
      superAdmin: "SuperAdmin1234!",
      schoolAdmin: "Admin1234!",
    },
  };
};
